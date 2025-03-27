# GPT-IQ Chat Interface Implementation Plan

## Overview
This document outlines the detailed implementation plan for recreating the GPT-IQ chat interface. The interface consists of a dark-themed sidebar and main chat area with support for Arabic language.

## Color Palette
- Sidebar background: `#202123`
- Main background: `#1B1C1D`
- Input background: `#2A2B32`
- Accent green: `#06DF72`
- Accent blue: `#0b93f6`
- Text gray: `#8E8EA0`
- Border color: `#444654`

## Visual Components Breakdown

### 1. Layout Structure
- Two-column layout: Left sidebar (darker) + main chat area (slightly lighter)
- Full-height application: Extends to cover entire viewport
- Responsive design considerations: Sidebar might collapse on mobile

### 2. Sidebar Elements
- **Logo Section**:
  - Green "GPT-IQ" logo with distinctive pattern at top
  - Positioned centrally within its container
  - Subtle border separator below

- **New Chat Button**:
  - Rounded black button with light border (`#444654`)
  - Plus icon aligned left of text
  - "NEW CHAT" text in uppercase, centered vertically
  - Slightly darker than the sidebar background

- **Recent Section**:
  - Small "Recent" label in muted gray (`#8E8EA0`)
  - Four identical chat history items
  - Each item has message icon followed by "Chat History" text
  - Thin separators between items
  - Hover state likely slightly lighter than background

- **Footer**:
  - Small copyright text "Designed & Developed by MicroWhale. All right reserved"
  - Centered alignment
  - Light gray color (`#8E8EA0`)
  - Thin top border separator

### 3. Main Chat Area
- **Welcome Message**:
  - Arabic text "الله بالخير .. حل نسولف" prominently displayed
  - Mixed coloring: "الله" in green (`#06DF72`), "بالخير" in blue (`#0b93f6`), "حل نسولف" in green (`#06DF72`)
  - Centered on the screen
  - Large font size

- **Chat Input**:
  - Rounded-pill input field at bottom
  - Dark gray background (`#2A2B32`)
  - Green circular icon on left side
  - Arabic placeholder text "اكتبي، سؤال، إسأل، إي شي..." right-aligned
  - Subtle border around input

## Implementation Steps

### Step 1: Project Setup
1. Create a Next.js application with TypeScript for type safety
2. Set up TailwindCSS for styling
3. Configure proper RTL support for Arabic text
4. Define the color palette constants

### Step 2: Base Layout Structure
1. Create a responsive container that spans 100% height
2. Set up the two-column layout using Flexbox or Grid
   - Sidebar: Fixed width (256px)
   - Main area: Flexible width (flex-grow: 1)
3. Implement responsive breakpoints for mobile view
4. Apply the correct background colors

### Step 3: Sidebar Implementation
1. Create the logo component:
   - Import and position the SVG logo
   - Add proper padding and alignment
   - Add subtle border-bottom

2. Create the "New Chat" button:
   - Style as pill-shaped button (fully rounded)
   - Set background color to match sidebar
   - Add border with color `#444654`
   - Position plus icon and "NEW CHAT" text with proper spacing
   - Implement hover state

3. Implement the "Recent" section:
   - Add the small "Recent" label with proper styling and color
   - Create the chat history item component with:
     - Message icon
     - "Chat History" text
     - Proper padding and alignment
   - Repeat this component four times
   - Add proper spacing between items
   - Implement hover states

4. Create the footer:
   - Add copyright text with proper styling
   - Center text horizontally
   - Set text color to `#8E8EA0`
   - Add top border

### Step 4: Chat Area Implementation
1. Create the welcome message component:
   - Position text in center of empty chat area
   - Split text into three spans with different colors
   - Apply correct right-to-left (RTL) direction
   - Set font sizing and weight

2. Implement the chat input component:
   - Create pill-shaped input field
   - Set background color to `#2A2B32`
   - Add the green circle icon on left side
   - Set placeholder text with RTL alignment
   - Position at bottom of the chat area
   - Ensure text flows right-to-left for Arabic input

### Step 5: State Management
1. Implement state for chat messages:
   - Create a messages array to store conversation
   - Each message should track type (user/AI), content, and timestamp
   - Update state when new messages are sent or received

2. Implement chat session management:
   - Track active chat session
   - Allow creation of new chat sessions
   - Enable switching between sessions
   - Store chat history

### Step 6: Functionality Implementation
1. Implement sending messages:
   - Capture input value and send on enter or button click
   - Clear input field after sending
   - Add message to conversation state
   - Scroll to bottom of conversation

2. Implement chat history interaction:
   - Make chat history items clickable
   - Change active session when clicked
   - Visual indication of active session

### Step 7: Accessibility and Internationalization
1. Ensure proper RTL support throughout the application
2. Implement keyboard navigation
3. Add proper ARIA attributes for screen readers
4. Ensure proper text contrast for readability

### Step 8: Polish and Performance
1. Add subtle animations for interactions:
   - Message appearing
   - Input focus states
   - Button hover states
2. Implement loading states for messages
3. Optimize image and SVG assets
4. Implement lazy loading for chat history

### Step 9: Testing
1. Test responsive behavior on different screen sizes
2. Verify RTL text display is correct
3. Test keyboard navigation and accessibility
4. Ensure color contrasts meet accessibility standards

### Step 10: Cross-browser Testing
1. Verify appearance in major browsers
2. Test on different devices (desktop, tablet, mobile)
3. Address any browser-specific styling issues

## Key Technical Considerations

1. **RTL Text Support**: Ensure proper bidirectional text handling for mixing Arabic and English

2. **SVG Implementation**: The logo needs to be implemented as a properly sized and colored SVG

3. **Layout Stability**: The design should maintain its proportions and spacing across different screen sizes

4. **Color Consistency**: Use the exact color codes from the design to maintain the visual identity

5. **Performance**: The chat interface should remain responsive even with many messages

6. **Text Rendering**: Ensure proper font loading for Arabic characters to avoid rendering issues

## Component Structure

```
app/
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx
│   └── ui/
│       ├── ChatContainer.tsx
│       ├── ChatInput.tsx
│       ├── ChatMessage.tsx
│       └── Loading.tsx
├── lib/
│   └── hooks/
│       └── useChat.ts
├── chat/
│   └── page.tsx
└── page.tsx
```

## Next Steps
After implementing the basic UI structure, focus on connecting the interface to a backend service that can process the chat interactions and provide appropriate responses.