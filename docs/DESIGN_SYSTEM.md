# Design System Reference


---

## 🎨 Design System Reference (MANDATORY)

> **CRITICAL:** Every UI element in this phase MUST follow this design system.
> These values come from the user's selected design. Do NOT use generic Tailwind/shadcn defaults.
> Read `docs/CONTEXT.md` → Design System section for the full spec.

**Design:** Forbidden Fruit — The design should create a sense of allure and seduction, drawing users into a world of forbidden pleasures and secret desires. The layout should be dark and moody, with bold typography and striking imagery to create a sense of drama and intrigue. The color palette should feature deep, rich colors such as burgundy, navy blue, and black, with subtle accents of red or pink to hint at the sensual nature of the platform.

**Color Palette:**
| Role | Color | Tailwind Usage |
|------|-------|----------------|
| Primary | `#660033` | `bg-primary`, `text-primary`, `border-primary` |
| Secondary | `#330033` | `bg-secondary`, gradients with primary |
| Accent | `#FF0033` | Badges, tags, notification dots |
| Background | `#09090b` | `bg-background` (set in globals.css) |

**Color Scheme:** Deep, rich colors with bold accents
**Typography:** Bold, dramatic fonts with a mix of serif and sans-serif
**Mode:** dark
**Imagery Style:** Sensual, provocative images and illustrations
**Animation Level:** Dramatic, attention-grabbing animations to enhance the user experience

**Animation Rules (Dramatic, attention-grabbing animations to enhance the user experience):**
- Use `transition-colors duration-200` on cards and buttons
- Add scroll-triggered animations: `animate-in fade-in duration-300`
- Page transitions: wrap route content in `<motion.div>` with fade/slide
- Stagger animations on card lists: `style={{ animationDelay: `${index * 100}ms` }}`
- Loading skeletons: `animate-pulse` on placeholder elements
- Number animations: count-up effect on stat values

**Component Patterns (use these EXACT classes):**
- **Cards:** `rounded-md border border-border bg-card shadow-sm p-6 hover:shadow-md hover:border-primary/30 transition-all`
- **Glass cards:** `bg-card/30 backdrop-blur-md border border-border/30 shadow-lg`
- **Primary buttons:** `rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-200`
- **Ghost buttons:** `rounded px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors duration-200`
- **Section spacing:** `py-20 md:py-32` between sections, `gap-6` between cards
- **Headings:** `font-bold`, can use `bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent` for premium feel
- **Muted text:** `text-muted-foreground` (NOT `text-gray-500` or any hardcoded gray)
- **Borders:** `border-border/50` (subtle) or `border-primary/15` (accent tint)
- **Inputs:** `rounded border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`
- **Badges:** `rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors duration-200`
- **Hover on cards:** `group hover:border-primary/30` + child elements use `group-hover:` utilities

**Premium Polish Patterns:**
- Background glow blobs: `absolute rounded-full bg-primary/5 blur-3xl` behind hero sections
- Gradient mesh: `bg-gradient-to-br from-primary/5 via-transparent to-accent/5`
- Stagger animations: `style={{ animationDelay: `${index * 100}ms` }}` on card lists
- Icon containers: `p-2.5 rounded-md bg-primary/10 text-primary`
- Stat numbers: `text-3xl font-bold` with gradient text on key metrics

**RULES:**
1. NEVER use hardcoded colors (`bg-blue-500`, `text-gray-400`, `#3b82f6`). ALWAYS use CSS variables via Tailwind semantic classes.
2. NEVER use plain unstyled HTML. Every element must have Tailwind classes.
3. Every card MUST have hover effect (shadow + translate or border color change).
4. Every section MUST look premium — if it looks "flat" or "basic", add gradient bg, glass effect, or decorative blur blob.
5. After building: compare your output against a Dribbble/Behance design. If it wouldn't get likes there, polish more.
