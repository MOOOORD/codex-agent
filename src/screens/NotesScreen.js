 import React, { useState, useEffect } from 'react';
 import {
   View, Text, TextInput, FlatList, TouchableOpacity,
   Modal, Alert, StyleSheet,
 } from 'react-native';
 import { Ionicons } from '@expo/vector-icons';
 import { Colors, Spacing, Radius, Shadows } from '../constants/theme';
 import { getNotes, addNote, deleteNote } from '../services/storage';

 export default function NotesScreen() {
   const [notes, setNotes] = useState([]);
   const [modalVisible, setModalVisible] = useState(false);
   const [newNoteText, setNewNoteText] = useState('');

   useEffect(() => {
     loadNotes();
   }, []);

   async function loadNotes() {
     const data = await getNotes();
     setNotes(data);
   }

   async function handleAdd() {
     const text = newNoteText.trim();
     if (!text) return;

     const note = await addNote(text);
     setNotes(prev => [note, ...prev]);
     setNewNoteText('');
     setModalVisible(false);
   }

   function handleDelete(id) {
     Alert.alert('删除笔记', '确定要删除这条笔记吗？', [
       { text: '取消', style: 'cancel' },
       {
         text: '删除', style: 'destructive',
         onPress: async () => {
           await deleteNote(id);
           setNotes(prev => prev.filter(n => n.id !== id));
         },
       },
     ]);
   }

   function formatDate(iso) {
     const d = new Date(iso);
     const month = d.getMonth() + 1;
     const day = d.getDate();
     const hour = String(d.getHours()).padStart(2, '0');
     const min = String(d.getMinutes()).padStart(2, '0');
     return `${month}/${day} ${hour}:${min}`;
   }

   function truncate(text, max = 60) {
     return text.length > max ? text.slice(0, max) + '...' : text;
   }

   return (
     <View style={styles.container}>
       {/* 顶部栏 */}
       <View style={styles.header}>
         <Text style={styles.headerTitle}>小记本</Text>
         <TouchableOpacity
           style={styles.addBtn}
           onPress={() => setModalVisible(true)}
         >
           <Ionicons name="add" size={24} color="#FFF" />
         </TouchableOpacity>
       </View>

       {/* 笔记列表 */}
       {notes.length === 0 ? (
         <View style={styles.empty}>
           <Ionicons name="book-outline" size={64} color={Colors.textLight} />
           <Text style={styles.emptyTitle}>还没有笔记</Text>
           <Text style={styles.emptySubtitle}>点右上角的 + 记下你的第一个想法吧</Text>
         </View>
       ) : (
         <FlatList
           data={notes}
           keyExtractor={item => item.id}
           contentContainerStyle={styles.list}
           renderItem={({ item }) => (
             <TouchableOpacity
               style={styles.noteCard}
               onLongPress={() => handleDelete(item.id)}
               activeOpacity={0.7}
             >
               <View style={styles.noteHeader}>
                 <Text style={styles.noteDate}>{formatDate(item.createdAt)}</Text>
                 <TouchableOpacity onPress={() => handleDelete(item.id)}>
                   <Ionicons name="close-circle" size={18} color={Colors.textLight} />
                 </TouchableOpacity>
               </View>
               <Text style={styles.noteText}>{item.text}</Text>
             </TouchableOpacity>
           )}
         />
       )}

       {/* 新增弹窗 */}
       <Modal
         animationType="slide"
         transparent={true}
         visible={modalVisible}
         onRequestClose={() => setModalVisible(false)}
       >
         <View style={styles.modalOverlay}>
           <View style={styles.modalContent}>
             <Text style={styles.modalTitle}>新笔记</Text>
             <TextInput
               style={styles.modalInput}
               value={newNoteText}
               onChangeText={setNewNoteText}
               placeholder="写点什么..."
               placeholderTextColor={Colors.textLight}
               multiline
               autoFocus
             />
             <View style={styles.modalButtons}>
               <TouchableOpacity
                 style={styles.cancelBtn}
                 onPress={() => {
                   setModalVisible(false);
                   setNewNoteText('');
                 }}
               >
                 <Text style={styles.cancelBtnText}>取消</Text>
               </TouchableOpacity>
               <TouchableOpacity
                 style={[styles.saveBtn, !newNoteText.trim() && styles.saveBtnDisabled]}
                 onPress={handleAdd}
                 disabled={!newNoteText.trim()}
               >
                 <Text style={styles.saveBtnText}>保存</Text>
               </TouchableOpacity>
             </View>
           </View>
         </View>
       </Modal>
     </View>
   );
 }

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: Colors.background,
   },
   header: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     paddingHorizontal: Spacing.xl,
     paddingVertical: Spacing.md,
     backgroundColor: Colors.surface,
     borderBottomWidth: 1,
     borderBottomColor: Colors.border,
   },
   headerTitle: {
     fontSize: 18,
     fontWeight: '700',
     color: Colors.text,
   },
   addBtn: {
     width: 36,
     height: 36,
     borderRadius: 18,
     backgroundColor: Colors.primary,
     justifyContent: 'center',
     alignItems: 'center',
   },
   list: {
     padding: Spacing.lg,
   },
   noteCard: {
     backgroundColor: Colors.surface,
     borderRadius: Radius.md,
     padding: Spacing.lg,
     marginBottom: Spacing.md,
     borderWidth: 1,
     borderColor: Colors.border,
     ...Shadows.sm,
   },
   noteHeader: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     marginBottom: Spacing.sm,
   },
   noteDate: {
     fontSize: 12,
     color: Colors.textLight,
   },
   noteText: {
     fontSize: 15,
     color: Colors.text,
     lineHeight: 22,
   },
   empty: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     paddingBottom: 60,
   },
   emptyTitle: {
     fontSize: 18,
     fontWeight: '600',
     color: Colors.textLight,
     marginTop: Spacing.lg,
   },
   emptySubtitle: {
     fontSize: 14,
     color: Colors.textLight,
     marginTop: Spacing.sm,
   },
   modalOverlay: {
     flex: 1,
     justifyContent: 'flex-end',
     backgroundColor: 'rgba(0,0,0,0.4)',
   },
   modalContent: {
     backgroundColor: Colors.surface,
     borderTopLeftRadius: Radius.xl,
     borderTopRightRadius: Radius.xl,
     padding: Spacing.xxl,
     paddingBottom: 40,
   },
   modalTitle: {
     fontSize: 18,
     fontWeight: '700',
     color: Colors.text,
     marginBottom: Spacing.lg,
   },
   modalInput: {
     backgroundColor: Colors.background,
     borderRadius: Radius.md,
     padding: Spacing.lg,
     fontSize: 15,
     color: Colors.text,
     minHeight: 120,
     textAlignVertical: 'top',
     borderWidth: 1,
     borderColor: Colors.border,
   },
   modalButtons: {
     flexDirection: 'row',
     justifyContent: 'flex-end',
     marginTop: Spacing.lg,
     gap: Spacing.sm,
   },
   cancelBtn: {
     paddingHorizontal: Spacing.xl,
     paddingVertical: Spacing.md,
     borderRadius: Radius.md,
     backgroundColor: Colors.background,
     borderWidth: 1,
     borderColor: Colors.border,
   },
   cancelBtnText: {
     fontSize: 15,
     color: Colors.textSecondary,
     fontWeight: '600',
   },
   saveBtn: {
     paddingHorizontal: Spacing.xl,
     paddingVertical: Spacing.md,
     borderRadius: Radius.md,
     backgroundColor: Colors.primary,
   },
   saveBtnDisabled: {
     backgroundColor: Colors.border,
   },
   saveBtnText: {
     fontSize: 15,
     color: '#FFF',
     fontWeight: '600',
   },
 });
