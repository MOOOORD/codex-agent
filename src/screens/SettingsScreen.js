 import React, { useState, useEffect } from 'react';
 import {
   View, Text, TextInput, TouchableOpacity, ScrollView,
   Alert, ActivityIndicator, Platform, StyleSheet,
 } from 'react-native';
 import { Ionicons } from '@expo/vector-icons';
 import { Colors, Spacing, Radius, Shadows } from '../constants/theme';
 import { getApiKey, saveApiKey, getModel, saveModel, clearChatHistory } from '../services/storage';
 import { validateApiKey } from '../services/api';

 export default function SettingsScreen() {
   const [apiKey, setApiKey] = useState('');
   const [model, setModel] = useState('deepseek-chat');
   const [saved, setSaved] = useState(false);
   const [validating, setValidating] = useState(false);
   const [keyValid, setKeyValid] = useState(null); // null = unchecked, true/false

   useEffect(() => {
     loadSettings();
   }, []);

   async function loadSettings() {
     const key = await getApiKey();
     const mdl = await getModel();
     if (key) setApiKey(key);
     setModel(mdl);
   }

   async function handleSave() {
     if (!apiKey.trim()) {
       Alert.alert('提示', '请先输入 API Key');
       return;
     }

     setValidating(true);
     setKeyValid(null);

     const isValid = await validateApiKey(apiKey.trim());
     setValidating(false);
     setKeyValid(isValid);

     if (!isValid) {
       Alert.alert('验证失败', '这个 API Key 好像不太对，请检查后重试');
       return;
     }

     await saveApiKey(apiKey.trim());
     await saveModel(model);
     setSaved(true);
     setTimeout(() => setSaved(false), 2000);
   }

   async function handleClearChat() {
     Alert.alert('清空对话', '确定要清空所有聊天记录吗？这个操作不可撤销。', [
       { text: '取消', style: 'cancel' },
       {
         text: '清空', style: 'destructive',
         onPress: async () => {
           await clearChatHistory();
           Alert.alert('已清空', '聊天记录已清空');
         },
       },
     ]);
   }

   const models = [
     { id: 'deepseek-chat', name: 'DeepSeek Chat', desc: '通用对话模型，速度快' },
     { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', desc: '深度推理模型，适合复杂问题' },
   ];

   return (
     <ScrollView style={styles.container} contentContainerStyle={styles.content}>
       {/* API Key 设置 */}
       <Text style={styles.sectionTitle}>API 配置</Text>
       <View style={styles.card}>
         <Text style={styles.label}>DeepSeek API Key</Text>
         <TextInput
           style={styles.input}
           value={apiKey}
           onChangeText={(text) => {
             setApiKey(text);
             setKeyValid(null);
           }}
           placeholder="sk-..."
           placeholderTextColor={Colors.textLight}
           secureTextEntry
           autoCapitalize="none"
           autoCorrect={false}
         />
         {keyValid === true && (
           <View style={styles.validRow}>
             <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
             <Text style={styles.validText}>Key 有效</Text>
           </View>
         )}
         {keyValid === false && (
           <View style={styles.validRow}>
             <Ionicons name="close-circle" size={16} color={Colors.error} />
             <Text style={[styles.validText, { color: Colors.error }]}>Key 无效</Text>
           </View>
         )}

         <Text style={[styles.label, { marginTop: Spacing.xl }]}>模型选择</Text>
         {models.map((m) => (
           <TouchableOpacity
             key={m.id}
             style={[styles.modelOption, model === m.id && styles.modelOptionActive]}
             onPress={() => setModel(m.id)}
           >
             <View style={styles.radio}>
               {model === m.id && <View style={styles.radioInner} />}
             </View>
             <View style={styles.modelInfo}>
               <Text style={[styles.modelName, model === m.id && styles.modelNameActive]}>
                 {m.name}
               </Text>
               <Text style={styles.modelDesc}>{m.desc}</Text>
             </View>
           </TouchableOpacity>
         ))}

         <TouchableOpacity
           style={[styles.saveBtn, saved && styles.saveBtnSaved]}
           onPress={handleSave}
           disabled={validating}
         >
           {validating ? (
             <ActivityIndicator size="small" color="#FFF" />
           ) : saved ? (
             <>
               <Ionicons name="checkmark" size={18} color="#FFF" />
               <Text style={styles.saveBtnText}>已保存</Text>
             </>
           ) : (
             <Text style={styles.saveBtnText}>保存设置</Text>
           )}
         </TouchableOpacity>
       </View>

       {/* 数据管理 */}
       <Text style={styles.sectionTitle}>数据管理</Text>
       <View style={styles.card}>
         <TouchableOpacity style={styles.dangerBtn} onPress={handleClearChat}>
           <Ionicons name="trash-outline" size={18} color={Colors.error} />
           <Text style={styles.dangerBtnText}>清空所有聊天记录</Text>
         </TouchableOpacity>
       </View>

       {/* 关于 */}
       <Text style={styles.sectionTitle}>关于</Text>
       <View style={styles.card}>
         <View style={styles.aboutRow}>
           <Text style={styles.aboutLabel}>应用名称</Text>
           <Text style={styles.aboutValue}>Codex 智能助手</Text>
         </View>
         <View style={styles.divider} />
         <View style={styles.aboutRow}>
           <Text style={styles.aboutLabel}>版本</Text>
           <Text style={styles.aboutValue}>1.0.0</Text>
         </View>
         <View style={styles.divider} />
         <View style={styles.aboutRow}>
           <Text style={styles.aboutLabel}>AI 引擎</Text>
           <Text style={styles.aboutValue}>DeepSeek API</Text>
         </View>
       </View>

       <Text style={styles.footer}>
         把 Codex 放在手机上，随时陪你聊天 💜
       </Text>
     </ScrollView>
   );
 }

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: Colors.background,
   },
   content: {
     padding: Spacing.lg,
     paddingBottom: 40,
   },
   sectionTitle: {
     fontSize: 13,
     fontWeight: '600',
     color: Colors.textLight,
     textTransform: 'uppercase',
     letterSpacing: 1,
     marginTop: Spacing.xxl,
     marginBottom: Spacing.sm,
     marginLeft: Spacing.xs,
   },
   card: {
     backgroundColor: Colors.surface,
     borderRadius: Radius.md,
     padding: Spacing.lg,
     borderWidth: 1,
     borderColor: Colors.border,
     ...Shadows.sm,
   },
   label: {
     fontSize: 14,
     fontWeight: '600',
     color: Colors.text,
     marginBottom: Spacing.sm,
   },
   input: {
     backgroundColor: Colors.background,
     borderRadius: Radius.sm,
     padding: Spacing.md,
     fontSize: 14,
     color: Colors.text,
     borderWidth: 1,
     borderColor: Colors.border,
     fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
   },
   validRow: {
     flexDirection: 'row',
     alignItems: 'center',
     marginTop: Spacing.sm,
   },
   validText: {
     fontSize: 13,
     color: Colors.success,
     marginLeft: Spacing.xs,
   },
   modelOption: {
     flexDirection: 'row',
     alignItems: 'center',
     paddingVertical: Spacing.md,
     paddingHorizontal: Spacing.md,
     borderRadius: Radius.sm,
     marginBottom: Spacing.xs,
   },
   modelOptionActive: {
     backgroundColor: Colors.surfaceAlt,
   },
   radio: {
     width: 20,
     height: 20,
     borderRadius: 10,
     borderWidth: 2,
     borderColor: Colors.primary,
     justifyContent: 'center',
     alignItems: 'center',
     marginRight: Spacing.md,
   },
   radioInner: {
     width: 10,
     height: 10,
     borderRadius: 5,
     backgroundColor: Colors.primary,
   },
   modelInfo: {
     flex: 1,
   },
   modelName: {
     fontSize: 15,
     fontWeight: '600',
     color: Colors.text,
   },
   modelNameActive: {
     color: Colors.primary,
   },
   modelDesc: {
     fontSize: 13,
     color: Colors.textSecondary,
     marginTop: 2,
   },
   saveBtn: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'center',
     backgroundColor: Colors.primary,
     borderRadius: Radius.md,
     paddingVertical: Spacing.md,
     marginTop: Spacing.xl,
   },
   saveBtnSaved: {
     backgroundColor: Colors.success,
   },
   saveBtnText: {
     color: '#FFF',
     fontSize: 15,
     fontWeight: '600',
     marginLeft: Spacing.xs,
   },
   dangerBtn: {
     flexDirection: 'row',
     alignItems: 'center',
     paddingVertical: Spacing.md,
   },
   dangerBtnText: {
     fontSize: 15,
     color: Colors.error,
     marginLeft: Spacing.sm,
   },
   divider: {
     height: 1,
     backgroundColor: Colors.divider,
   },
   aboutRow: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
     paddingVertical: Spacing.md,
   },
   aboutLabel: {
     fontSize: 15,
     color: Colors.text,
   },
   aboutValue: {
     fontSize: 15,
     color: Colors.textSecondary,
   },
   footer: {
     textAlign: 'center',
     fontSize: 13,
     color: Colors.textLight,
     marginTop: Spacing.xxxl,
     lineHeight: 20,
   },
 });
