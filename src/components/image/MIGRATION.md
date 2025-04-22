# ImageKit Migration Guide

This document provides step-by-step instructions for migrating from the Next.js Image component to our OptimizedImage component which uses ImageKit for image optimization.

## Migration Options

There are three approaches to migrate your components:

### Option 1: Direct Migration (Recommended)

Replace the Next.js Image component with our OptimizedImage component directly. This is the cleanest and most recommended approach.

1. Replace imports:
   ```diff
   - import Image from "next/image";
   + import OptimizedImage from "@/components/OptimizedImage";
   ```

2. Replace component usage:
   ```diff
   - <Image 
   -   src="/image.jpg" 
   -   alt="Description" 
   -   width={400} 
   -   height={300} 
   - />
   + <OptimizedImage 
   +   src="/image.jpg" 
   +   alt="Description" 
   +   width={400} 
   +   height={300} 
   + />
   ```

3. Adjust props as needed:
   - Make sure to pass quality as a number (not a string)
   - Add any specific optimizations using the `transformations` prop
   - Consider adding placeholder for improved loading experience

### Option 2: Using MigratedImage Helper (Easiest)

Use the MigratedImage component which is a drop-in replacement for Next.js Image.

1. Replace imports:
   ```diff
   - import Image from "next/image";
   + import Image from "@/components/MigratedImage";
   ```

2. No need to change component usage, it works with the same props!

3. After testing, eventually convert to Option 1 for better customization.

### Option 3: Automated Script (Bulk Migration)

For bulk migration, you can use our migration script:

```bash
node scripts/migrate-to-imagekit.js
```

This script will scan your codebase for Next.js Image usage and provide suggestions for each file.

## Migration Checklist

For each component using images:

- [ ] Replace imports
- [ ] Replace component usage
- [ ] Test loading, rendering and optimization
- [ ] Verify responsive behavior
- [ ] Check placeholder/loading behavior
- [ ] Analyze network requests to ensure optimizations are applied

## Migration Best Practices

1. **Migrate incrementally**: Start with less critical components and gradually move to more important ones.

2. **Test thoroughly**: After each migration, verify:
   - Images load correctly
   - Responsive behavior works as expected
   - Layout shifts don't occur
   - Performance improvements are realized

3. **Use proper sizing**: Always specify `width` and `height` to avoid layout shifts.

4. **Use appropriate transformations**:
   ```jsx
   <OptimizedImage
     src="/image.jpg"
     alt="Description"
     width={400}
     height={300}
     transformations={[
       // Add specialized transformations here
       { crop: 'maintain_ratio' },
       { effect: 'sharpen' }
     ]}
   />
   ```

5. **For background images**: Use the `fill` property with a container:
   ```jsx
   <div className="relative h-[300px]">
     <OptimizedImage
       src="/background.jpg"
       alt="Background"
       fill
       sizes="100vw"
       objectFit="cover"
     />
   </div>
   ```

6. **For above-the-fold images**: Use the `priority` prop:
   ```jsx
   <OptimizedImage
     src="/hero.jpg"
     alt="Hero"
     width={1200}
     height={600}
     priority
   />
   ```

## Common Issues and Solutions

### Issue: Layout Shifts
**Solution**: Always specify width and height. For responsive images, use aspect ratio containers.

### Issue: Blurry Images
**Solution**: Verify quality settings and make sure appropriate sizes are specified.

### Issue: External Images
**Solution**: For external images, use the web proxy format:
```jsx
<OptimizedImage
  src="/https://example.com/image.jpg"
  alt="External image"
  width={400}
  height={300}
/>
```

### Issue: Animated Images
**Solution**: For GIFs or animated content:
```jsx
<OptimizedImage
  src="/animation.gif"
  alt="Animation"
  width={400}
  height={300}
  unoptimized // For GIFs, keeping the original might be better
/>
```

## Reference

For more details, refer to:
- [IMAGE_OPTIMIZATION.md](./IMAGE_OPTIMIZATION.md) - Our image optimization strategy
- [ImageKit Next.js Documentation](https://imagekit.io/docs/integration/nextjs)

## Support

If you encounter any issues during migration, please contact the front-end team. 