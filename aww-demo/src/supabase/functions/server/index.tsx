import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Admin-Token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper to create Supabase admin client
const getSupabaseAdmin = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
};

// Helper to create Supabase client with anon key
const getSupabaseAnon = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
  );
};

// Helper to verify user from access token
const verifyUser = async (request: Request) => {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { user: null, error: 'No access token provided' };
  }
  
  const supabase = getSupabaseAdmin();
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  
  if (error || !user) {
    return { user: null, error: 'Invalid or expired token' };
  }
  
  return { user, error: null };
};

// Helper to verify admin from token
const verifyAdmin = async (request: Request) => {
  const adminToken = request.headers.get('X-Admin-Token');
  
  if (!adminToken) {
    return { isAdmin: false, error: 'No admin token provided' };
  }
  
  // Get admin data from KV store
  const adminData = await kv.get('admin:session:' + adminToken);
  
  if (!adminData || adminData.expiresAt < Date.now()) {
    return { isAdmin: false, error: 'Invalid or expired admin token' };
  }
  
  return { isAdmin: true, adminId: adminData.adminId, error: null };
};

// ============================================
// INITIALIZATION - CREATE PLACEHOLDER EVENTS
// ============================================

// Track if initialization has been done
let isInitialized = false;

// Initialize placeholder events if none exist
const initializePlaceholderEvents = async () => {
  try {
    console.log('[INIT] Checking for placeholder events...');
    
    // Define placeholder event IDs
    const placeholderEventIds = [
      'event-placeholder-1',
      'event-placeholder-2', 
      'event-placeholder-3',
      'event-placeholder-4',
      'event-placeholder-5',
      'event-placeholder-6',
      'event-placeholder-7'
    ];
    
    // Check which placeholders already exist
    const existingPlaceholders = await kv.mget(placeholderEventIds.map(id => `event:${id}`));
    const existingIds = existingPlaceholders
      .map((val, idx) => val ? placeholderEventIds[idx] : null)
      .filter(id => id !== null);
    
    if (existingIds.length === placeholderEventIds.length) {
      console.log('[INIT] All placeholder events already exist, skipping creation');
      return;
    }
    
    console.log('[INIT] Creating placeholder events...');
    
    const placeholderEvents = [
        {
          id: 'event-placeholder-1',
          title: 'Women in Leadership Summit 2025',
          date: '2025-03-15',
          time: '9:00 AM - 5:00 PM',
          location: 'Downtown Conference Center',
          address: '456 Leadership Ave, Hope City, HC 12345',
          category: 'Leadership',
          description: 'Join us for an inspiring day of leadership development, networking, and empowerment. Hear from successful women leaders across various industries.',
          speakers: ['Dr. Sarah Johnson', 'Maria Rodriguez', 'Angela Chen'],
          capacity: 200,
          registered: 0,
          price: '$50',
          image: 'https://images.unsplash.com/photo-1646296066880-c61cac79470b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGxlYWRlcnNoaXAlMjBidXNpbmVzc3xlbnwxfHx8fDE3NjA5Mjk2NDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
          status: 'upcoming',
          createdAt: new Date().toISOString()
        },
        {
          id: 'event-placeholder-2',
          title: 'Wellness & Self-Care Workshop',
          date: '2025-03-22',
          time: '2:00 PM - 4:00 PM',
          location: 'Serenity Wellness Center',
          address: '789 Calm Street, Hope City, HC 12345',
          category: 'Wellness',
          description: 'Discover practical self-care strategies and wellness techniques designed specifically for busy women. Learn to prioritize your health and well-being.',
          speakers: ['Jessica Martinez', 'Dr. Emily Thompson'],
          capacity: 50,
          registered: 0,
          price: 'Free',
          image: 'https://images.unsplash.com/photo-1729105137329-d2878bbbb021?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMG1lZGl0YXRpb24lMjB3b21lbnxlbnwxfHx8fDE3NjA5Mjk2NDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
          status: 'upcoming',
          createdAt: new Date().toISOString()
        },
        {
          id: 'event-placeholder-3',
          title: 'Financial Empowerment Seminar',
          date: '2025-04-10',
          time: '6:00 PM - 8:00 PM',
          location: 'Community Learning Hub',
          address: '321 Finance Road, Hope City, HC 12345',
          category: 'Financial',
          description: 'Take control of your financial future! Learn about investing, budgeting, and building wealth with expert financial advisors.',
          speakers: ['Rachel Kim', 'Patricia Williams'],
          capacity: 100,
          registered: 0,
          price: '$25',
          image: 'https://images.unsplash.com/photo-1758522484692-efa6ce38a25f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBwbGFubmluZyUyMHdvbWFufGVufDF8fHx8MTc2MDkyOTY0MXww&ixlib=rb-4.1.0&q=80&w=1080',
          status: 'upcoming',
          createdAt: new Date().toISOString()
        },
        {
          id: 'event-placeholder-4',
          title: 'Creative Expression Through Art',
          date: '2025-04-20',
          time: '10:00 AM - 12:00 PM',
          location: 'Creative Arts Studio',
          address: '555 Artist Lane, Hope City, HC 12345',
          category: 'Arts & Culture',
          description: 'Unleash your creativity in this hands-on art workshop. All skill levels welcome! Materials provided.',
          speakers: ['Isabella Santos'],
          capacity: 30,
          registered: 0,
          price: '$35',
          image: 'https://images.unsplash.com/photo-1725819242793-e83d3e08d439?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBwYWludGluZyUyMGNyZWF0aXZlfGVufDF8fHx8MTc2MDgzMzI0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
          status: 'upcoming',
          createdAt: new Date().toISOString()
        },
        {
          id: 'event-placeholder-5',
          title: 'Mentorship Speed Networking',
          date: '2025-05-05',
          time: '5:30 PM - 7:30 PM',
          location: 'Innovation Center',
          address: '888 Network Blvd, Hope City, HC 12345',
          category: 'Networking',
          description: 'Connect with mentors and peers in various fields through our exciting speed networking format. Build meaningful professional relationships.',
          speakers: ['Multiple Mentors'],
          capacity: 80,
          registered: 0,
          price: 'Free',
          image: 'https://images.unsplash.com/photo-1758520144420-3e5b22e9b9a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JraW5nJTIwcHJvZmVzc2lvbmFsJTIwbWVldGluZ3xlbnwxfHx8fDE3NjA5Mjk2NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
          status: 'upcoming',
          createdAt: new Date().toISOString()
        },
        {
          id: 'event-placeholder-6',
          title: 'Women Who Code Hackathon',
          date: '2025-02-28',
          time: '9:00 AM - 6:00 PM',
          location: 'Tech Innovation Lab',
          address: '222 Code Street, Hope City, HC 12345',
          category: 'Technology',
          description: 'A full-day hackathon celebrating women in technology. Teams competed to build innovative solutions for community challenges.',
          speakers: ['Tech Leaders Panel'],
          capacity: 60,
          registered: 45,
          price: 'Free',
          image: 'https://images.unsplash.com/photo-1634078111185-8c26c5cbc294?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNvZGluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYwOTI5NjQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
          status: 'past',
          createdAt: new Date().toISOString()
        },
        {
          id: 'event-placeholder-7',
          title: 'International Women\'s Day Celebration',
          date: '2025-03-08',
          time: '6:00 PM - 9:00 PM',
          location: 'Grand Hall',
          address: '100 Celebration Plaza, Hope City, HC 12345',
          category: 'Community',
          description: 'Celebrated International Women\'s Day with inspiring speakers, performances, and a celebration of women\'s achievements throughout history.',
          speakers: ['Mayor Jennifer Lopez', 'Community Leaders'],
          capacity: 300,
          registered: 287,
          price: '$15',
          image: 'https://images.unsplash.com/photo-1685540943103-67acf2ccc5db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZWxlYnJhdGlvbiUyMHdvbWVuJTIwZW1wb3dlcm1lbnR8ZW58MXx8fHwxNzYwOTI5NjQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
          status: 'past',
          createdAt: new Date().toISOString()
        }
      ];
      
      // Save or update each placeholder event
      let createdCount = 0;
      let updatedCount = 0;
      
      for (const event of placeholderEvents) {
        if (!existingIds.includes(event.id)) {
          // Create new placeholder event
          await kv.set(`event:${event.id}`, event);
          console.log(`[INIT] Created placeholder event: ${event.title}`);
          createdCount++;
        } else {
          // Check if existing event needs image update
          const existingEvent = await kv.get(`event:${event.id}`);
          if (existingEvent && (!existingEvent.image || existingEvent.image === '')) {
            // Update the existing event with the new image
            const updatedEvent = { ...existingEvent, image: event.image };
            await kv.set(`event:${event.id}`, updatedEvent);
            console.log(`[INIT] Updated placeholder event with image: ${event.title}`);
            updatedCount++;
          }
        }
      }
      
      console.log(`[INIT] Successfully created ${createdCount} new placeholder events and updated ${updatedCount} with images`);
  } catch (error) {
    console.error('[INIT] Error creating placeholder events:', error);
  }
};

// ============================================
// ENDPOINTS
// ============================================

// Health check endpoint
app.get("/make-server-27ffc17a/health", async (c) => {
  // Run initialization on first request if not done yet
  if (!isInitialized) {
    console.log('[Health] Running initialization...');
    await initializePlaceholderEvents();
    isInitialized = true;
  }
  return c.json({ status: "ok" });
});

// Debug endpoint to check placeholder events specifically
app.get("/make-server-27ffc17a/debug/placeholder-events", async (c) => {
  try {
    const placeholderIds = [
      'event-placeholder-1',
      'event-placeholder-2', 
      'event-placeholder-3',
      'event-placeholder-4',
      'event-placeholder-5',
      'event-placeholder-6',
      'event-placeholder-7'
    ];
    
    const results = {};
    for (const id of placeholderIds) {
      const event = await kv.get(`event:${id}`);
      results[id] = event ? {
        title: event.title,
        hasImage: !!event.image,
        imageUrl: event.image || 'NO IMAGE',
        imageLength: event.image ? event.image.length : 0
      } : 'NOT FOUND';
    }
    
    return c.json({ placeholderEvents: results });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Debug endpoint to check all KV keys
app.get("/make-server-27ffc17a/debug/kv-keys", async (c) => {
  try {
    const eventKeys = await kv.getByPrefix('event:');
    const adminKeys = await kv.getByPrefix('admin:');
    
    return c.json({ 
      success: true,
      eventCount: eventKeys.length,
      events: eventKeys,
      adminKeyCount: adminKeys.length
    });
  } catch (error) {
    console.log('Error in debug endpoint:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Sign up endpoint
app.post("/make-server-27ffc17a/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password || !firstName || !lastName) {
      return c.json({ error: 'Missing required fields: email, password, firstName, lastName' }, 400);
    }

    const supabase = getSupabaseAdmin();
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { firstName, lastName },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Supabase auth error during signup:', error);
      return c.json({ error: `Sign up failed: ${error.message}` }, 400);
    }

    if (!data.user) {
      return c.json({ error: 'Sign up failed: No user created' }, 500);
    }

    // Store additional profile data in KV store
    const profileData = {
      userId: data.user.id,
      email,
      firstName,
      lastName,
      phone: '',
      bio: '',
      location: '',
      profileImage: '',
      joinDate: new Date().toISOString(),
      stats: {
        storiesShared: 0,
        likesReceived: 0,
        eventsAttended: 0,
        totalDonated: 0
      }
    };

    await kv.set(`profile:${data.user.id}`, profileData);

    // Sign in the user to get a session
    const anonSupabase = getSupabaseAnon();
    const { data: signInData, error: signInError } = await anonSupabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.session) {
      console.log('Auto sign-in error after signup:', signInError);
      return c.json({ 
        success: true,
        message: 'Account created successfully. Please sign in.',
        userId: data.user.id 
      });
    }

    return c.json({ 
      success: true,
      accessToken: signInData.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName,
        lastName
      }
    });
  } catch (error) {
    console.log('Error in signup endpoint:', error);
    return c.json({ error: `Sign up error: ${error.message}` }, 500);
  }
});

// Sign in endpoint
app.post("/make-server-27ffc17a/signin", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ error: 'Missing email or password' }, 400);
    }

    const supabase = getSupabaseAnon();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Sign in error:', error);
      return c.json({ error: `Sign in failed: ${error.message}` }, 401);
    }

    if (!data.session || !data.user) {
      return c.json({ error: 'Sign in failed: No session created' }, 500);
    }

    // Get profile data from KV store
    const profileData = await kv.get(`profile:${data.user.id}`);

    return c.json({ 
      success: true,
      accessToken: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        firstName: profileData?.firstName || '',
        lastName: profileData?.lastName || ''
      }
    });
  } catch (error) {
    console.log('Error in signin endpoint:', error);
    return c.json({ error: `Sign in error: ${error.message}` }, 500);
  }
});

// Get current session
app.get("/make-server-27ffc17a/session", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.raw);
    
    if (error || !user) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    // Get profile data from KV store
    const profileData = await kv.get(`profile:${user.id}`);

    return c.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: profileData?.firstName || '',
        lastName: profileData?.lastName || ''
      }
    });
  } catch (error) {
    console.log('Error in session endpoint:', error);
    return c.json({ error: `Session error: ${error.message}` }, 500);
  }
});

// Sign out endpoint
app.post("/make-server-27ffc17a/signout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 400);
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.auth.admin.signOut(accessToken);

    if (error) {
      console.log('Sign out error:', error);
      // Don't fail - token might already be invalid
    }

    return c.json({ success: true });
  } catch (error) {
    console.log('Error in signout endpoint:', error);
    return c.json({ error: `Sign out error: ${error.message}` }, 500);
  }
});

// Get user profile
app.get("/make-server-27ffc17a/profile", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.raw);
    
    if (error || !user) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const profileData = await kv.get(`profile:${user.id}`);

    if (!profileData) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({ success: true, profile: profileData });
  } catch (error) {
    console.log('Error in get profile endpoint:', error);
    return c.json({ error: `Get profile error: ${error.message}` }, 500);
  }
});

// Update user profile
app.post("/make-server-27ffc17a/profile", async (c) => {
  try {
    const { user, error } = await verifyUser(c.req.raw);
    
    if (error || !user) {
      return c.json({ error: 'Not authenticated' }, 401);
    }

    const body = await c.req.json();
    const existingProfile = await kv.get(`profile:${user.id}`);

    if (!existingProfile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    // Update profile data
    const updatedProfile = {
      ...existingProfile,
      ...body,
      userId: user.id, // Ensure userId can't be changed
      email: user.email, // Keep email from auth
    };

    await kv.set(`profile:${user.id}`, updatedProfile);

    return c.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.log('Error in update profile endpoint:', error);
    return c.json({ error: `Update profile error: ${error.message}` }, 500);
  }
});

// ============================================
// ADMIN AUTHENTICATION ENDPOINTS
// ============================================

// Admin login endpoint
app.post("/make-server-27ffc17a/admin/login", async (c) => {
  try {
    const body = await c.req.json();
    const { username, password } = body;

    if (!username || !password) {
      return c.json({ error: 'Missing username or password' }, 400);
    }

    // Get admin credentials from KV store
    const adminCreds = await kv.get('admin:credentials');
    
    // Initialize default admin if none exists
    if (!adminCreds) {
      const defaultAdmin = {
        username: 'admin',
        password: 'AWW2025!Admin', // In production, this should be hashed
        adminId: 'admin-001'
      };
      await kv.set('admin:credentials', defaultAdmin);
      
      // Check against default
      if (username === defaultAdmin.username && password === defaultAdmin.password) {
        const token = crypto.randomUUID();
        const sessionData = {
          adminId: defaultAdmin.adminId,
          username: defaultAdmin.username,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        await kv.set(`admin:session:${token}`, sessionData);
        
        return c.json({
          success: true,
          token,
          admin: { username: defaultAdmin.username }
        });
      }
    } else {
      // Verify credentials
      if (username === adminCreds.username && password === adminCreds.password) {
        const token = crypto.randomUUID();
        const sessionData = {
          adminId: adminCreds.adminId,
          username: adminCreds.username,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        await kv.set(`admin:session:${token}`, sessionData);
        
        return c.json({
          success: true,
          token,
          admin: { username: adminCreds.username }
        });
      }
    }

    return c.json({ error: 'Invalid credentials' }, 401);
  } catch (error) {
    console.log('Error in admin login:', error);
    return c.json({ error: `Admin login error: ${error.message}` }, 500);
  }
});

// Admin logout endpoint
app.post("/make-server-27ffc17a/admin/logout", async (c) => {
  try {
    const adminToken = c.req.header('X-Admin-Token');
    
    if (adminToken) {
      await kv.del(`admin:session:${adminToken}`);
    }

    return c.json({ success: true });
  } catch (error) {
    console.log('Error in admin logout:', error);
    return c.json({ error: `Admin logout error: ${error.message}` }, 500);
  }
});

// Verify admin session
app.get("/make-server-27ffc17a/admin/verify", async (c) => {
  try {
    const { isAdmin, error } = await verifyAdmin(c.req.raw);
    
    if (!isAdmin) {
      return c.json({ error: error || 'Not authenticated' }, 401);
    }

    return c.json({ success: true, isAdmin: true });
  } catch (error) {
    console.log('Error verifying admin:', error);
    return c.json({ error: `Verification error: ${error.message}` }, 500);
  }
});

// ============================================
// EVENT MANAGEMENT ENDPOINTS
// ============================================

// Get all events
app.get("/make-server-27ffc17a/events", async (c) => {
  try {
    // Run initialization on first request if not done yet
    if (!isInitialized) {
      console.log('[GET /events] Running initialization...');
      await initializePlaceholderEvents();
      isInitialized = true;
    }
    
    console.log('[GET /events] Fetching all events...');
    const eventsData = await kv.getByPrefix('event:');
    console.log('[GET /events] Raw eventsData from KV:', JSON.stringify(eventsData, null, 2));
    console.log('[GET /events] Number of events found:', eventsData.length);
    
    const events = eventsData.map(item => {
      console.log('[GET /events] Processing event:', item.key, item.value);
      return item.value;
    }).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    console.log('[GET /events] Returning events:', events.length);
    return c.json({ success: true, events });
  } catch (error) {
    console.log('[GET /events] Error fetching events:', error);
    return c.json({ error: `Fetch events error: ${error.message}` }, 500);
  }
});

// Create event (admin only)
app.post("/make-server-27ffc17a/admin/events", async (c) => {
  try {
    console.log('[POST /admin/events] Starting event creation...');
    const { isAdmin, error } = await verifyAdmin(c.req.raw);
    
    if (!isAdmin) {
      console.log('[POST /admin/events] Unauthorized - not admin');
      return c.json({ error: 'Unauthorized' }, 401);
    }

    console.log('[POST /admin/events] Admin verified, parsing body...');
    const body = await c.req.json();
    console.log('[POST /admin/events] Request body:', JSON.stringify(body, null, 2));
    
    const { 
      title, 
      date, 
      time, 
      location, 
      address, 
      category, 
      description, 
      speakers, 
      capacity, 
      price, 
      image, 
      status 
    } = body;

    if (!title || !date || !time || !location || !category || !description) {
      console.log('[POST /admin/events] Missing required fields');
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const eventId = `event-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    console.log('[POST /admin/events] Generated event ID:', eventId);
    
    const eventData = {
      id: eventId,
      title,
      date,
      time,
      location,
      address: address || '',
      category,
      description,
      speakers: speakers || [],
      capacity: capacity || 100,
      registered: 0,
      price: price || 'Free',
      image: image || '',
      status: status || 'upcoming',
      createdAt: new Date().toISOString()
    };

    console.log('[POST /admin/events] Event data to save:', JSON.stringify(eventData, null, 2));
    console.log('[POST /admin/events] Saving to KV with key:', `event:${eventId}`);
    
    const kvResult = await kv.set(`event:${eventId}`, eventData);
    console.log('[POST /admin/events] KV set result:', kvResult);
    
    // Verify it was saved
    const verification = await kv.get(`event:${eventId}`);
    console.log('[POST /admin/events] Verification read:', JSON.stringify(verification, null, 2));
    
    if (!verification) {
      console.error('[POST /admin/events] CRITICAL: Event was not saved to KV store!');
      return c.json({ error: 'Failed to save event to database' }, 500);
    }

    console.log('[POST /admin/events] Event created successfully');
    return c.json({ success: true, event: eventData });
  } catch (error) {
    console.log('[POST /admin/events] Error creating event:', error);
    console.log('[POST /admin/events] Error stack:', error.stack);
    return c.json({ error: `Create event error: ${error.message}` }, 500);
  }
});

// Update event (admin only)
app.put("/make-server-27ffc17a/admin/events/:eventId", async (c) => {
  try {
    const { isAdmin, error } = await verifyAdmin(c.req.raw);
    
    if (!isAdmin) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const eventId = c.req.param('eventId');
    const body = await c.req.json();

    const existingEvent = await kv.get(`event:${eventId}`);
    
    if (!existingEvent) {
      return c.json({ error: 'Event not found' }, 404);
    }

    const updatedEvent = {
      ...existingEvent,
      ...body,
      id: eventId, // Ensure ID can't be changed
      updatedAt: new Date().toISOString()
    };

    await kv.set(`event:${eventId}`, updatedEvent);

    return c.json({ success: true, event: updatedEvent });
  } catch (error) {
    console.log('Error updating event:', error);
    return c.json({ error: `Update event error: ${error.message}` }, 500);
  }
});

// Delete event (admin only)
app.delete("/make-server-27ffc17a/admin/events/:eventId", async (c) => {
  try {
    const { isAdmin, error } = await verifyAdmin(c.req.raw);
    
    if (!isAdmin) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const eventId = c.req.param('eventId');
    
    const existingEvent = await kv.get(`event:${eventId}`);
    
    if (!existingEvent) {
      return c.json({ error: 'Event not found' }, 404);
    }

    await kv.del(`event:${eventId}`);

    return c.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.log('Error deleting event:', error);
    return c.json({ error: `Delete event error: ${error.message}` }, 500);
  }
});

// Fix placeholder event images (admin only)
app.post("/make-server-27ffc17a/admin/fix-placeholder-images", async (c) => {
  try {
    const { isAdmin, error } = await verifyAdmin(c.req.raw);
    
    if (!isAdmin) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    console.log('[FIX IMAGES] Starting to fix placeholder event images...');

    const imageMap = {
      'event-placeholder-1': 'https://images.unsplash.com/photo-1646296066880-c61cac79470b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGxlYWRlcnNoaXAlMjBidXNpbmVzc3xlbnwxfHx8fDE3NjA5Mjk2NDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'event-placeholder-2': 'https://images.unsplash.com/photo-1729105137329-d2878bbbb021?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMG1lZGl0YXRpb24lMjB3b21lbnxlbnwxfHx8fDE3NjA5Mjk2NDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'event-placeholder-3': 'https://images.unsplash.com/photo-1758522484692-efa6ce38a25f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBwbGFubmluZyUyMHdvbWFufGVufDF8fHx8MTc2MDkyOTY0MXww&ixlib=rb-4.1.0&q=80&w=1080',
      'event-placeholder-4': 'https://images.unsplash.com/photo-1725819242793-e83d3e08d439?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBwYWludGluZyUyMGNyZWF0aXZlfGVufDF8fHx8MTc2MDgzMzI0N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      'event-placeholder-5': 'https://images.unsplash.com/photo-1758520144420-3e5b22e9b9a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JraW5nJTIwcHJvZmVzc2lvbmFsJTIwbWVldGluZ3xlbnwxfHx8fDE3NjA5Mjk2NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'event-placeholder-6': 'https://images.unsplash.com/photo-1634078111185-8c26c5cbc294?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNvZGluZyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYwOTI5NjQyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      'event-placeholder-7': 'https://images.unsplash.com/photo-1685540943103-67acf2ccc5db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjZWxlYnJhdGlvbiUyMHdvbWVuJTIwZW1wb3dlcm1lbnR8ZW58MXx8fHwxNzYwOTI5NjQyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    };

    let updatedCount = 0;
    let notFoundCount = 0;

    for (const [eventId, imageUrl] of Object.entries(imageMap)) {
      const event = await kv.get(`event:${eventId}`);
      
      if (event) {
        event.image = imageUrl;
        await kv.set(`event:${eventId}`, event);
        console.log(`[FIX IMAGES] Updated ${eventId} with image`);
        updatedCount++;
      } else {
        console.log(`[FIX IMAGES] Event ${eventId} not found`);
        notFoundCount++;
      }
    }

    console.log(`[FIX IMAGES] Updated ${updatedCount} events, ${notFoundCount} not found`);
    return c.json({ 
      success: true, 
      updated: updatedCount, 
      notFound: notFoundCount,
      message: `Updated ${updatedCount} placeholder events with images` 
    });
  } catch (error) {
    console.error('[FIX IMAGES] Error:', error);
    return c.json({ error: `Fix images error: ${error.message}` }, 500);
  }
});

// Upload image endpoint (admin only)
app.post("/make-server-27ffc17a/admin/upload", async (c) => {
  try {
    const { isAdmin, error } = await verifyAdmin(c.req.raw);
    
    if (!isAdmin) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.json();
    const { image, fileName } = body;

    if (!image || !fileName) {
      return c.json({ error: 'Missing image data or filename' }, 400);
    }

    // Create bucket if it doesn't exist
    const supabase = getSupabaseAdmin();
    const bucketName = 'make-27ffc17a-events';
    
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: true });
    }

    // Convert base64 to buffer
    const base64Data = image.split(',')[1] || image;
    const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Upload to storage
    const filePath = `${Date.now()}-${fileName}`;
    const { data, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: 'image/jpeg',
        upsert: false
      });

    if (uploadError) {
      console.log('Upload error:', uploadError);
      return c.json({ error: `Upload failed: ${uploadError.message}` }, 500);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return c.json({ success: true, url: publicUrl });
  } catch (error) {
    console.log('Error uploading image:', error);
    return c.json({ error: `Upload error: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);