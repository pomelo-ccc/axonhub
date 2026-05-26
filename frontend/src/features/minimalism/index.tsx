import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sparkles,
  Layers,
  Zap,
  Flame,
  ArrowRight,
  Check,
  ToggleLeft,
  ToggleRight,
  Eye
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';

export default function HolographicGuide() {
  const { t } = useTranslation();
  const [isHoloMode, setIsHoloMode] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Mock data for the interactive sandbox
  const demoData = {
    title: "AxonHub Portal v3.0: Holographic Interface",
    author: "Iris Chromatic",
    date: "May 26, 2026",
    readingTime: "4 min read",
    summary: "As metaverses and virtual exhibitions continue to merge with AI, visual interfaces are transforming from static flat designs to responsive, chromatic substrates. In this guide, we break down the refraction physics behind our iridescent design token library.",
    stats: [
      { label: "Flow Rate", value: "88.4 GB/s", change: "+16.8%" },
      { label: "Bevel Refract", value: "1.42 n", change: "Stable" },
      { label: "Glow Index", value: "99.96", change: "+4.1%" }
    ]
  };

  return (
    <div className="flex-1 space-y-8 p-6 pt-5">
      <Header />
      
      {/* Introduction Hero Section */}
      <div className="max-w-4xl space-y-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Holographic Design Substrate / 全息彩膜视觉原则
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 sm:text-5xl lg:text-6xl animate-pulse">
          Holographic UI 极光彩膜
        </h1>
        <p className="text-lg leading-8 text-muted-foreground sm:text-xl font-light">
          用虹彩渐变、折射高光与流动光泽营造强烈的未来科技感与沉浸感。它为时尚科技、元宇宙虚拟展馆以及音乐潮流活动页量身打造，将信息与薄膜随光线流动的艺术完美融合。
        </p>
      </div>

      {/* Grid: 4 Core Principles */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: 虹彩流动 */}
        <div className={`p-6 border transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
          isHoloMode 
            ? 'border-white/30 bg-white/20 shadow-lg rounded-xl hover:border-pink-300' 
            : 'border-border bg-card shadow-xs rounded-lg'
        }`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10 text-pink-500 mb-4">
            <Flame className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground mb-2">1. 虹彩流动</h3>
          <p className="text-xs leading-5 text-muted-foreground font-light">
            使用柔焦后的多色渐变（粉、紫、青、银）模拟薄膜折射，并配合平滑的循环动画，使背景呈现犹如极光般的流动感。
          </p>
        </div>

        {/* Card 2: specularity 折射高光 */}
        <div className={`p-6 border transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
          isHoloMode 
            ? 'border-white/30 bg-white/20 shadow-lg rounded-xl hover:border-purple-300' 
            : 'border-border bg-card shadow-xs rounded-lg'
        }`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 mb-4">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground mb-2">2. specularity 高光斜切</h3>
          <p className="text-xs leading-5 text-muted-foreground font-light">
            通过线性斜向渐变模拟卡片镜面反射。悬停时高光产生位移，卡片产生轻微的缩放与悬浮抬升，充满未来材质感。
          </p>
        </div>

        {/* Card 3: 玻璃态叠加 */}
        <div className={`p-6 border transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
          isHoloMode 
            ? 'border-white/30 bg-white/20 shadow-lg rounded-xl hover:border-cyan-300' 
            : 'border-border bg-card shadow-xs rounded-lg'
        }`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500 mb-4">
            <Layers className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground mb-2">3. 玻璃态容器</h3>
          <p className="text-xs leading-5 text-muted-foreground font-light">
            卡片采用半透明白（或暗色玻璃），底色叠加高强度高斯模糊（`blur(16px)`），确保内容文本的可读性与前景的清晰对比。
          </p>
        </div>

        {/* Card 4: 霓虹发光边框 */}
        <div className={`p-6 border transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
          isHoloMode 
            ? 'border-white/30 bg-white/20 shadow-lg rounded-xl hover:border-indigo-300' 
            : 'border-border bg-card shadow-xs rounded-lg'
        }`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 mb-4">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-foreground mb-2">4. 霓虹发光边框</h3>
          <p className="text-xs leading-5 text-muted-foreground font-light">
            卡片边框采用高亮度渐变线或半透明白描边，阴影使用色彩晕染（如轻量级粉色/青色投影），避免使用沉重死板的黑色。
          </p>
        </div>
      </div>

      {/* Interactive Playground / 交互对比沙盒 */}
      <div className="border border-white/20 bg-white/10 rounded-xl p-6 md:p-8 space-y-6 backdrop-blur-md shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/20 pb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Iridescent Sandbox / 彩膜设计沙盒</h2>
            <p className="text-sm text-muted-foreground font-light mt-1">切换下方的样式模式，即时体验“常规设计”与“极光彩膜全息设计”在材质、反射和阴影上的对比。</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-primary font-semibold">
              {isHoloMode ? 'Holographic Mode (全息彩膜)' : 'Flat Mode (常规设计)'}
            </span>
            <button 
              onClick={() => setIsHoloMode(!isHoloMode)} 
              className="focus:outline-none hover:opacity-85 transition-opacity"
              aria-label="Toggle demo mode"
            >
              {isHoloMode ? (
                <ToggleRight className="h-8 w-8 text-primary" />
              ) : (
                <ToggleLeft className="h-8 w-8 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Sandbox Content Split */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Controls and Explication */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm uppercase tracking-[0.15em] font-semibold text-muted-foreground">Physics Properties / 物理特征对比</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 text-primary">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <strong className="block text-foreground font-medium">Specular & Glow / 镜面高光与发光</strong>
                    <span className="text-muted-foreground font-light">
                      {isHoloMode ? '斜向折射渐变叠加。Hover 时高光滑动，带有彩虹霓虹的轻薄阴影晕染。' : '无高光折射。常规灰色 1px 描边与沉重灰色阴影。'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 text-primary">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <strong className="block text-foreground font-medium">Opacity & Blur / 不透明度与背景模糊</strong>
                    <span className="text-muted-foreground font-light">
                      {isHoloMode ? '25% 不透明白，融合 blur(16px) 的毛玻璃。使底部的彩虹渐变透出。' : '100% 实色背景 card，无法透出底层背景色。'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5 text-primary">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <strong className="block text-foreground font-medium">Button Gradients / 虹彩按钮</strong>
                    <span className="text-muted-foreground font-light">
                      {isHoloMode ? '多色光谱渐变（粉-紫-青）。Hover 时渐变滑动且带有发光扩展。' : '常规纯单色按钮。'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-white/20 bg-white/5">
              <span className="text-xs font-mono uppercase text-primary">Designer Holographic Note / 设计手记</span>
              <p className="text-xs leading-5 text-muted-foreground font-light mt-1.5">
                全息风格的关键在“透”与“折”。玻璃容器必须有高饱和的 backdrop-filter，同时配合 1px 半透明白色边框，才能在流动背景下勾勒出极为高级的物理分界线。
              </p>
            </div>
          </div>

          {/* Rendering Box */}
          <div className="lg:col-span-7 flex flex-col justify-center border border-white/25 bg-white/5 rounded-2xl p-6 min-h-[380px] relative overflow-hidden">
            {/* Animated mini-background under sandbox */}
            {isHoloMode && (
              <div 
                className="absolute inset-0 z-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(135deg, oklch(0.92 0.08 320) 0%, oklch(0.90 0.06 270) 25%, oklch(0.94 0.06 200) 50%, oklch(0.96 0.02 120) 75%, oklch(0.92 0.08 320) 100%)',
                  backgroundSize: '400% 400%',
                  animation: 'holo-gradient 10s ease infinite'
                }}
              />
            )}

            <div className="space-y-6 relative z-10">
              {/* Preview card wrapper */}
              <div 
                className={`transition-all duration-300 w-full relative overflow-hidden ${
                  isHoloMode 
                    ? 'border border-white/45 bg-white/25 rounded-2xl p-6 backdrop-blur-md' 
                    : 'border border-border bg-card rounded-lg p-6 shadow-sm'
                }`}
                onMouseEnter={() => setHoveredCard(1)}
                onMouseLeave={() => setHoveredCard(1 === null ? null : null)}
                style={isHoloMode && hoveredCard === 1 ? {
                  transform: 'translateY(-4px) scale(1.008)',
                  boxShadow: '0 12px 30px rgba(236, 72, 153, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
                  borderColor: 'rgba(255, 255, 255, 0.65)'
                } : isHoloMode ? {
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.05), inset 0 1px 2px rgba(255, 255, 255, 0.3)'
                } : {}}
              >
                {/* Mirror reflection sheet overlay inside holo card */}
                {isHoloMode && (
                  <div 
                    className="absolute inset-0 pointer-events-none transition-all duration-700"
                    style={{
                      background: 'linear-gradient(125deg, transparent 40%, rgba(255, 255, 255, 0.15) 50%, transparent 60%)',
                      backgroundSize: '200% 200%',
                      backgroundPosition: hoveredCard === 1 ? '0% 0%' : '100% 100%'
                    }}
                  />
                )}

                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className={`text-[10px] font-mono tracking-wider uppercase ${isHoloMode ? 'text-primary' : 'text-muted-foreground'}`}>{demoData.readingTime}</span>
                    <h4 className="text-lg font-bold tracking-tight text-foreground mt-1 mb-2">{demoData.title}</h4>
                    <p className="text-xs text-muted-foreground font-light">
                      By {demoData.author} • {demoData.date}
                    </p>
                  </div>
                  <Eye className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </div>

                <hr className={`my-4 border-t ${isHoloMode ? 'border-white/20' : 'border-border'}`} />

                <p className="text-sm leading-6 text-foreground/80 font-light mb-6">
                  {demoData.summary}
                </p>

                {/* Stats Section inside sandbox */}
                <div className={`grid grid-cols-3 gap-4 border-t pt-4 ${isHoloMode ? 'border-white/10' : 'border-border/60'}`}>
                  {demoData.stats.map((stat, i) => (
                    <div key={i} className="space-y-1">
                      <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                      <span className="block text-base font-bold tracking-tight text-foreground">{stat.value}</span>
                      <span className={`block text-[10px] ${
                        stat.change.startsWith('+') ? 'text-cyan-500 font-semibold' : 'text-muted-foreground'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Holographic Buttons Example */}
              <div className="flex flex-wrap items-center gap-4 justify-center">
                <Button 
                  className={`transition-all duration-300 font-light ${
                    isHoloMode 
                      ? 'rounded-full border border-white/20 px-6 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 hover:from-pink-500 hover:to-cyan-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5' 
                      : 'rounded-md shadow-xs bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                  style={isHoloMode ? { backgroundSize: '200% auto' } : {}}
                >
                  Primary Gradient
                </Button>
                <Button 
                  variant="outline"
                  className={`transition-all duration-300 font-light ${
                    isHoloMode 
                      ? 'rounded-full border border-white/35 bg-white/10 hover:bg-white/20 text-foreground hover:-translate-y-0.5' 
                      : 'rounded-md text-muted-foreground border-border hover:bg-accent'
                  }`}
                >
                  Glassy Action
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applied Scenarios / 适用场景深度对照表 */}
      <div className="border border-white/20 bg-white/10 rounded-xl p-6 md:p-8 space-y-6 backdrop-blur-md">
        <h2 className="text-xl font-bold tracking-tight text-foreground border-b border-white/10 pb-4">Holographic Applied Scenarios / 全息风格适用场景</h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full">
              Highly Recommended / 绝佳适用场景
            </span>
            <ul className="space-y-2 text-sm text-muted-foreground font-light">
              <li className="flex gap-2">
                <span className="text-foreground shrink-0">•</span>
                <span><strong>潮流活动及元宇宙展 (Metaverses & Expositions)</strong>: 虹彩流动带来的折射光感天然带有未来色彩与虚拟属性，非常契合科技展会。</span>
              </li>
              <li className="flex gap-2">
                <span className="text-foreground shrink-0">•</span>
                <span><strong>时尚概念设计与潮牌页 (Fashion & Trend Stores)</strong>: 全息膜面材料能迅速给产品打上高端、探索、年轻和新锐的品牌标签。</span>
              </li>
              <li className="flex gap-2">
                <span className="text-foreground shrink-0">•</span>
                <span><strong>音乐节与数字艺术品展示 (Digital Art & Music)</strong>: 流光溢彩的光学变换可以衬托出音乐、音频及 NFT 艺术的虚幻感和数字生命力。</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full">
              Not Recommended / 应谨慎使用的场景
            </span>
            <ul className="space-y-2 text-sm text-muted-foreground font-light">
              <li className="flex gap-2">
                <span className="text-foreground shrink-0">•</span>
                <span><strong>高信息密度后台管理 (Admin Panels & Dashboards)</strong>: 彩膜大面积渲染可能会降低表格中数据的阅读对比度，干扰长时间工作。</span>
              </li>
              <li className="flex gap-2">
                <span className="text-foreground shrink-0">•</span>
                <span><strong>金融财务或政务类产品 (Financial & Government)</strong>: 流动光斑可能显得过于活泼动荡，不利于塑造金融政务所需的严肃与安全感。</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
