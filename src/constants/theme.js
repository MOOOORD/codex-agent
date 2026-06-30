 // Codex 移动端 Agent 主题

 export const Colors = {
   primary: '#7C5CFC',       // 温暖的紫罗兰 - 主色
   primaryLight: '#A78BFA',  // 浅紫
   primaryDark: '#5B3DC9',   // 深紫
   secondary: '#F472B6',     // 粉色点缀
   accent: '#34D399',        // 绿色 - 在线/成功

   background: '#FAFAFE',    // 极浅紫白背景
   surface: '#FFFFFF',       // 卡片/表面
   surfaceAlt: '#F5F0FF',    // 替代表面

   text: '#1E1B4B',          // 深紫灰 - 主文字
   textSecondary: '#6B7280', // 灰 - 次要文字
   textLight: '#9CA3AF',     // 浅灰 - 辅助文字

   border: '#E5E7EB',        // 边框
   divider: '#F3F4F6',       // 分割线

   userBubble: '#7C5CFC',    // 用户消息气泡
   botBubble: '#F5F0FF',     // AI 消息气泡
   userText: '#FFFFFF',      // 用户消息文字
   botText: '#1E1B4B',       // AI 消息文字

   error: '#EF4444',         // 错误红
   warning: '#F59E0B',       // 警告黄
   success: '#34D399',       // 成功绿

   shadow: 'rgba(124, 92, 252, 0.1)',  // 阴影色
 };

 export const Fonts = {
   regular: { fontSize: 15, color: Colors.text },
   small: { fontSize: 13, color: Colors.textSecondary },
   caption: { fontSize: 12, color: Colors.textLight },
   h1: { fontSize: 28, fontWeight: '700', color: Colors.text },
   h2: { fontSize: 22, fontWeight: '700', color: Colors.text },
   h3: { fontSize: 18, fontWeight: '600', color: Colors.text },
 };

 export const Spacing = {
   xs: 4,
   sm: 8,
   md: 12,
   lg: 16,
   xl: 20,
   xxl: 24,
   xxxl: 32,
 };

 export const Radius = {
   sm: 8,
   md: 12,
   lg: 16,
   xl: 20,
   full: 9999,
 };

 export const Shadows = {
   sm: {
     shadowColor: Colors.shadow,
     shadowOffset: { width: 0, height: 1 },
     shadowOpacity: 1,
     shadowRadius: 3,
     elevation: 2,
   },
   md: {
     shadowColor: Colors.shadow,
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 1,
     shadowRadius: 8,
     elevation: 4,
   },
 };
