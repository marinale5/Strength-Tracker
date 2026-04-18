## 2025-05-15 - Accessibility in Custom Visualizations
**Learning:** Custom UI components like progress bars and charts are often invisible to screen readers unless explicitly marked with ARIA-like attributes (accessibilityRole, accessibilityLabel, accessibilityValue).
**Action:** Always use `accessibilityRole="progressbar"` and provide detailed `accessibilityValue` for loading/progress indicators. For charts, provide descriptive `accessibilityLabel` for data points.

## 2025-05-15 - Component Import Best Practices
**Learning:** Missing component imports (like BossBattle or MuscleHeatmap) cause silent rendering failures or crashes in React Native if not properly caught.
**Action:** Ensure all utilized components in a screen are imported, and verify the file structure before implementation.
