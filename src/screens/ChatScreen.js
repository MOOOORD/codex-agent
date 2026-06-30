 import React, { useState, useEffect, useRef, useCallback } from 'react';
 import {
   View, Text, TextInput, FlatList, TouchableOpacity,
   KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
   StyleSheet,
 } from 'react-native';
 import { Ionicons } from '@expo/vector-icons';
 import { Colors, Spacing, Radius, Shadows } from '../constants/theme';
 import { SYSTEM_PROMPT, WELCOME_MESSAGE, SETTINGS_REMINDER } from '../constants/personality';
 import { sendMessage } from '../services/api';
 import { getApiKey, saveChatHistory, getChatHistory, clearChatHistory } from '../services/storage';
 import MessageBubble from '../components/MessageBubble';

 export default function ChatScreen() {
   const [messages, setMessages] = useState([]);
   const [input, setInput] = useState('');
   const [loading, setLoading] = useState(false);
   const [hasApiKey, setHasApiKey] = useState(false);
   const [streamingContent, setStreamingContent] = useState('');
   const flatListRef = useRef(null);

   useEffect(() => {
     loadChat();
   }, []);

   async function loadChat() {
     const key = await getApiKey();
     setHasApiKey(!!key);

     const history = await getChatHistory();
     if (history.length > 0) {
       setMessages(history);
     } else {
       setMessages(key ? [WELCOME_MESSAGE] : [SETTINGS_REMINDER]);
     }
   }

   async function handleSend() {
     const text = input.trim();
     if (!text || loading) return;

     // 检查 API Key
     const apiKey = await getApiKey();
     if (!apiKey) {
       Alert.alert('需要 API Key', '请先去「设置」页面填写你的 DeepSeek API Key');
       return;
     }

     setInput('');
     setLoading(true);
     setStreamingContent('');

     const userMsg = { role: 'user', content: text };
     const newMessages = [...messages, userMsg];
     setMessages(newMessages);

     // 构建完整消息列表（含系统提示）
     const apiMessages = [
       { role: 'system', content: SYSTEM_PROMPT },
       ...newMessages.map(m => ({ role: m.role, content: m.content })),
     ];

     try {
       // 添加一个占位消息用于流式显示
       const placeholderIdx = newMessages.length;
       setMessages([...newMessages, { role: 'assistant', content: '' }]);

       const content = await sendMessage(apiMessages, (streamed) => {
         setMessages(prev => {
           const updated = [...prev];
           updated[placeholderIdx] = { role: 'assistant', content: streamed };
           return updated;
         });
       });

       // 最终消息
       const finalMessages = [...newMessages, { role: 'assistant', content }];
       setMessages(finalMessages);
       await saveChatHistory(finalMessages);
     } catch (err) {
       Alert.alert('出错了', err.message);
       // 移除占位消息
       setMessages(newMessages);
     } finally {
       setLoading(false);
       setStreamingContent('');
     }
   }

   async function handleClear() {
     Alert.alert('清空对话', '确定要清空所有聊天记录吗？', [
       { text: '取消', style: 'cancel' },
       {
         text: '清空', style: 'destructive',
         onPress: async () => {
           await clearChatHistory();
           const key = await getApiKey();
           setMessages(key ? [WELCOME_MESSAGE] : [SETTINGS_REMINDER]);
         },
       },
     ]);
   }

   const renderItem = useCallback(({ item }) => (
     <MessageBubble message={item} />
   ), []);

   return (
     <KeyboardAvoidingView
       style={styles.container}
       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
       keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
     >
       {/* 顶部栏 */}
       <View style={styles.header}>
         <View style={styles.headerLeft}>
           <View style={styles.headerDot} />
           <Text style={styles.headerTitle}>Codex</Text>
         </View>
         <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
           <Ionicons name="trash-outline" size={18} color={Colors.textLight} />
         </TouchableOpacity>
       </View>

       {/* 消息列表 */}
       <FlatList
         ref={flatListRef}
         data={messages}
         renderItem={renderItem}
         keyExtractor={(_, i) => i.toString()}
         style={styles.messageList}
         contentContainerStyle={styles.messageContent}
         onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
         ListEmptyComponent={
           <View style={styles.empty}>
             <Text style={styles.emptyText}>开始和 Codex 聊天吧！</Text>
           </View>
         }
       />

       {/* 输入栏 */}
       <View style={styles.inputContainer}>
         <View style={styles.inputWrapper}>
           <TextInput
             style={styles.input}
             value={input}
             onChangeText={setInput}
             placeholder="给 Codex 发消息..."
             placeholderTextColor={Colors.textLight}
             multiline
             maxLength={4096}
             onSubmitEditing={handleSend}
             blurOnSubmit
           />
           <TouchableOpacity
             style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
             onPress={handleSend}
             disabled={!input.trim() || loading}
           >
             {loading ? (
               <ActivityIndicator size="small" color="#FFF" />
             ) : (
               <Ionicons name="send" size={18} color="#FFF" />
             )}
           </TouchableOpacity>
         </View>
       </View>
     </KeyboardAvoidingView>
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
   headerLeft: {
     flexDirection: 'row',
     alignItems: 'center',
   },
   headerDot: {
     width: 10,
     height: 10,
     borderRadius: 5,
     backgroundColor: Colors.accent,
     marginRight: Spacing.sm,
   },
   headerTitle: {
     fontSize: 18,
     fontWeight: '700',
     color: Colors.text,
   },
   clearBtn: {
     padding: Spacing.sm,
   },
   messageList: {
     flex: 1,
   },
   messageContent: {
     paddingVertical: Spacing.md,
   },
   empty: {
     alignItems: 'center',
     paddingTop: 40,
   },
   emptyText: {
     fontSize: 14,
     color: Colors.textLight,
   },
   inputContainer: {
     paddingHorizontal: Spacing.lg,
     paddingVertical: Spacing.sm,
     backgroundColor: Colors.surface,
     borderTopWidth: 1,
     borderTopColor: Colors.border,
   },
   inputWrapper: {
     flexDirection: 'row',
     alignItems: 'flex-end',
     backgroundColor: Colors.background,
     borderRadius: Radius.xl,
     paddingLeft: Spacing.lg,
     paddingRight: Spacing.xs,
     paddingVertical: Spacing.xs,
     borderWidth: 1,
     borderColor: Colors.border,
   },
   input: {
     flex: 1,
     fontSize: 15,
     color: Colors.text,
     maxHeight: 100,
     paddingVertical: Spacing.sm,
   },
   sendBtn: {
     width: 36,
     height: 36,
     borderRadius: 18,
     backgroundColor: Colors.primary,
     justifyContent: 'center',
     alignItems: 'center',
     marginLeft: Spacing.sm,
   },
   sendBtnDisabled: {
     backgroundColor: Colors.border,
   },
 });
