# EventHub Animations Guide

This document explains the animations added to the EventHub website and how to use or extend them.

## Overview

We've implemented several types of animations to enhance the user experience:

1. **Scroll Reveal Animations**: Elements appear with subtle animations as the user scrolls down the page
2. **Hover Animations**: Interactive elements respond to user hover actions
3. **Page Load Animations**: Elements fade in when the page first loads
4. **Interactive Animations**: Used for buttons, cards, and other interactive elements

## Events Section Animations

The Events Section features special advanced animations triggered by scrolling:

- **Section Title Animation**: A gradient line that animates from left to right under the section title
- **View Toggle Buttons**: A unified toggle control with two options (Grid and Calendar) that slides up when the section comes into view
  - Connected button design with rounded corners only on the outside edges
  - Smooth hover and active state transitions
  - Active button gets elevation with a subtle shadow
- **Event Cards**: Cards use a 3D reveal animation with the following features:
  - Staggered appearance (cards appear in sequence)
  - Subtle 3D rotation for depth perception
  - Cards initially "tilt" slightly before settling into position
  - Each row of cards has its own animation sequence

### Event Card Hover Effects

Event cards have enhanced hover animations:
- Cards lift up with increased shadow for a floating effect
- Card images scale up smoothly
- A subtle gradient overlay fades in for better text contrast
- Event type badges lift up with enhanced shadow
- All transitions use custom easing for natural motion

### Implementation

The animations are implemented using:
- CSS animations and transitions with cubic-bezier timing functions
- Intersection Observer API to trigger animations when elements enter the viewport
- Staggered delays using CSS nth-child selectors
- 3D transforms with perspective for depth

## Scroll Reveal Classes

Add these classes to elements you want to animate when they enter the viewport:

- `reveal-fade`: Simple fade-in effect
- `reveal-up`: Element slides up from below
- `reveal-left`: Element slides in from the left
- `reveal-right`: Element slides in from the right

These classes are automatically applied to common elements by the `animations.js` script.

## Hover Effect Classes

Add these to elements that should animate on hover:

- `hover-grow`: Element slightly increases in size
- `hover-shadow`: Element lifts up and shows a shadow
- `hover-pulse`: Element gently pulses on hover

## Social Media Icons

The footer includes enhanced social media icons with modern design and interactive animations:

- **Glass morphism effect**: Semi-transparent background with blur effect
- **Dynamic hover effects**: 
  - Each icon has a unique branded color on hover
  - Smooth floating animation with staggered timing
  - Scale effect on the icon itself
  - Gradient overlay that slides up from the bottom
- **Custom animations**:
  - `socialIconFloat`: A gentle floating animation for each icon
  - Each social icon has slightly different timing for a wave-like effect
- **Branded colors on hover**:
  - Facebook: Facebook blue (#4267B2)
  - X (Twitter): Twitter blue (#1DA1F2)
  - Instagram: Instagram gradient start color (#C13584)
  - LinkedIn: LinkedIn blue (#0A66C2)

The icons use Font Awesome 6 classes:
- Facebook: `fa-facebook-f`
- X (Twitter): `fa-x`
- Instagram: `fa-instagram`
- LinkedIn: `fa-linkedin-in`

## Adding Animations to New Elements

### Method 1: Add Classes Directly in HTML

```html
<div class="your-element reveal-up">
    Content here
</div>

<button class="btn hover-pulse">
    Click Me
</button>
```

### Method 2: Add Elements in the animations.js Script

Edit the `applyRevealClasses()` function in `js/animations.js` to target your new elements:

```javascript
// Add to the applyRevealClasses function
const yourElements = document.querySelectorAll('.your-element-class');
if (yourElements) {
    yourElements.forEach((element, index) => {
        if (!element.classList.contains('reveal-right')) {
            element.classList.add('reveal-right');
            // Add delay based on index for staggered effect
            element.style.transitionDelay = `${index * 0.1}s`;
        }
    });
}
```

## Keyframe Animations

The following keyframe animations are available:

- `fadeInUp`: Element fades in while moving up
- `fadeInRight`: Element fades in from the right
- `fadeInLeft`: Element fades in from the left
- `fadeIn`: Simple fade in
- `pulse`: Gentle pulsing effect
- `bounce`: Bouncing motion
- `rotateIn`: Rotate and fade in simultaneously
- `line-reveal`: Horizontal line that animates from left to right
- `toggle-reveal`: Buttons that slide up with a slight bounce
- `card-reveal`: 3D card reveal with perspective and rotation

### Using Keyframe Animations in CSS

```css
.your-element {
    animation: fadeInUp 1s ease;
}

/* With delay */
.your-element-delayed {
    animation: fadeInUp 1s ease 0.5s;
    animation-fill-mode: both; /* Ensures element stays invisible until animation starts */
}
```

## Best Practices

1. Use animations sparingly - too many can be distracting
2. Keep animations short (0.3-1s) for UI elements
3. Use slower animations (1-2s) for decorative elements
4. Ensure animations don't interfere with usability
5. Provide subtle feedback for interactive elements

## Browser Compatibility

These animations use standard CSS and JavaScript features supported by all modern browsers.

## Calendar View Animations

The Calendar view includes several animations for a more engaging user experience:

- **View Transition**: Smooth fade transition when switching between Grid and Calendar views
- **Calendar Element Animations**:
  - Buttons use the same styling as other site buttons with hover animations
  - Days have subtle scale and shadow effects on hover
  - Events have elevation animation on hover with color-coding by event type
  - The current day is highlighted with a special marker
- **Interactive Features**:
  - Custom tooltips appear when hovering over events with animation
  - Events expand slightly when hovered to indicate interactivity
  - Month/week transitions include a fade effect
  - Clicking events triggers the registration modal with smooth animation

### Calendar CSS Variables

The calendar uses custom CSS variables to match the site's color scheme:
```css
.fc {
    --fc-border-color: #e5e5e5;
    --fc-button-bg-color: var(--primary-color);
    --fc-button-border-color: var(--primary-color);
    --fc-button-hover-bg-color: var(--primary-dark);
    --fc-button-hover-border-color: var(--primary-dark);
    --fc-event-bg-color: var(--primary-color);
    --fc-event-border-color: var(--primary-color);
    --fc-today-bg-color: rgba(52, 152, 219, 0.1);
}
```

### Event Color Coding

Events in the calendar are color-coded by type for better visual organization:
- Cultural: Red (#e74c3c)
- Technical: Blue (#3498db)
- Sports: Green (#2ecc71)
- Workshop: Purple (#9b59b6)
- Seminar: Orange (#f39c12)
- Educational: Teal (#1abc9c) 