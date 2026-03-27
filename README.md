# Twitter-Landing-Page





##The Core Layout & Sidebar Navigation

Flexible Grid System: I bypassed traditional grid frameworks and built the core architecture entirely with CSS Flexbox. The body acts as the main flex container, perfectly balancing the left navigation sidebar, the central feed, and the right trends sidebar.

Sticky Positioning: I utilized position: sticky on both the left and right sidebars. This ensures the navigation and trending topics remain firmly anchored in the viewport while the user scrolls through the central feed.




##The Main Feed & Media Integration

Flexible Widths: The .main-feed container utilizes a width: 100% paired with a max-width: 600px. This approach allows the feed to act as the primary column on desktops while seamlessly shrinking to fill the entire screen on mobile devices without causing horizontal scrollbars.

Embedded Video Corrections: Official Twitter video embeds (iframe and .twitter-tweet) inject rigid, hard-coded widths that destroy mobile layouts. I used CSS !important overrides to forcefully strip their default sizing, forcing them to adopt the curved, responsive container styles of the clone.



##The Right Sidebar & Search

Visual Hierarchy: I implemented the search bar was to match twitter's bar. 

Component Design: The "Today's News", "What's Happening", and "Who to Follow" sections are modular .sidebar-card components. Hover states and transitioning photos were applied to the individual items to mimic interactivity.



##Advanced Responsive Breakpoints (Media Queries)

Instead of relying on a library, I wrote custom @media queries to orchestrate a complex, three-stage layout morph:

Tablet View (max-width: 1024px): The right sidebar is hidden . The left navigation text is taken away, and the flex container collapses the icons into a slim, vertical toolbar. 

Mobile View (max-width: 680px): The left sidebar entirely detaches from the document flow. Using position: fixed; bottom: 0;, it snaps to the bottom of the screen as a native-feeling app navigation bar. Flex order properties are explicitly reassigned to ensure the 5 core icons (Home, Explore, Grok, Notifications, Chat) appear in the exact sequence used by the official X/ twitter mobile app.



##The "DIY" Custom feature Dark Mode Toggle

I implemented a fully custom Dark Mode engine triggered by a floating action moonlight button.



## Custom features By CURSOR AI
To bring the static UI to life, I utilized Cursor AI to assist in writing the logic for two dynamic JavaScript features:



#The Splash Screen ("Splashback")

To mimic the feel of a native mobile application, the site features a custom loading splash screen. A full-screen black overlay with the X logo covers the DOM on initial load. 



#Live Tweet Injection & Dynamic Stats: The compose box at the top of the feed simulates a live database connection.

The "Post" button dynamically enables/disables based on the input field's length.

To make the clone feel "alive," a background interval function runs every 30 seconds, randomly incrementing the views, likes, and reposts on the newly created live tweets to mimic engagements. Although still needs to be fixed.