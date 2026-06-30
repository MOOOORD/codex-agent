 import React from 'react';
 import { View, Text, StyleSheet } from 'react-native';
 import { Colors, Spacing, Radius } from '../constants/theme';

 export default function MessageBubble({ message }) {
   const isUser = message.role === 'user';

   return (
     <View style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
       {!isUser && (
         <View style={styles.avatar}>
           <Text style={styles.avatarText}>C</Text>
         </View>
       )}
       <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
         <Text style={[styles.text, isUser ? styles.userText : styles.botText]}>
           {message.content}
         </Text>
       </View>
     </View>
   );
 }

 const styles = StyleSheet.create({
   container: {
     flexDirection: 'row',
     marginVertical: Spacing.xs,
     paddingHorizontal: Spacing.lg,
     alignItems: 'flex-end',
   },
   userContainer: {
     justifyContent: 'flex-end',
   },
   botContainer: {
     justifyContent: 'flex-start',
   },
   avatar: {
     width: 32,
     height: 32,
     borderRadius: 16,
     backgroundColor: Colors.primary,
     justifyContent: 'center',
     alignItems: 'center',
     marginRight: Spacing.sm,
     marginBottom: 2,
   },
   avatarText: {
     color: '#FFF',
     fontSize: 14,
     fontWeight: '700',
   },
   bubble: {
     maxWidth: '78%',
     paddingHorizontal: Spacing.lg,
     paddingVertical: Spacing.md,
     borderRadius: Radius.lg,
   },
   userBubble: {
     backgroundColor: Colors.userBubble,
     borderBottomRightRadius: Radius.sm,
   },
   botBubble: {
     backgroundColor: Colors.botBubble,
     borderBottomLeftRadius: Radius.sm,
     borderWidth: 1,
     borderColor: Colors.border,
   },
   text: {
     fontSize: 15,
     lineHeight: 22,
   },
   userText: {
     color: Colors.userText,
   },
   botText: {
     color: Colors.botText,
   },
 });
