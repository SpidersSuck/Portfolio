import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  LogOut, 
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Upload,
  Image as ImageIcon,
  Archive,
  ArchiveRestore,
  Home
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from './AuthContext';

export function AdminCMS({ onNavigateHome }: { onNavigateHome?: () => void }) {
  console.log('[AdminCMS] Component initializing');
  console.log('[AdminCMS] Config:', { projectId, publicAnonKey: publicAnonKey ? 'present' : 'missing' });
  
  const { user, signOut: authSignOut } = useAuth();
  
  // All state hooks must be called unconditionally
  const [isLoading, setIsLoading] = useState(true);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  
  // Events state
  const [events, setEvents] = useState<any[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<'events' | 'hero'>('events');
  
  // Hero images state
  const [heroImages, setHeroImages] = useState<any[]>([]);
  const [isAddingHeroImage, setIsAddingHeroImage] = useState(false);
  const [newHeroImage, setNewHeroImage] = useState({
    url: '',
    name: ''
  });
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false);
  
  // New event form
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    address: '',
    category: 'Leadership',
    description: '',
    speakers: '',
    capacity: 100,
    price: 'Free',
    image: '',
    status: 'upcoming'
  });

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-27ffc17a`;
  console.log('[AdminCMS] Base URL:', baseUrl);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date TBD';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date TBD';
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Date TBD';
    }
  };

  const loadEvents = useCallback(async (token: string) => {
    console.log('[AdminCMS] Loading events, token:', token ? 'present' : 'none');
    try {
      const response = await fetch(`${baseUrl}/events`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      console.log('[AdminCMS] Events response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('[AdminCMS] Events loaded:', data.events?.length || 0, 'events:', data.events);
        // Filter out null/undefined events
        const validEvents = (data.events || []).filter((e: any) => e !== null && e !== undefined);
        console.log('[AdminCMS] Valid events:', validEvents.length);
        setEvents(validEvents);
      } else {
        console.error('[AdminCMS] Failed to load events:', response.status);
        const errorText = await response.text();
        console.error('[AdminCMS] Error response:', errorText);
      }
    } catch (error) {
      console.error('[AdminCMS] Error loading events:', error);
      toast.error('Failed to load events');
    }
  }, [baseUrl, publicAnonKey]);

  const initializeDefaultHeroImages = useCallback(() => {
    const defaultImages = [
      {
        id: '1',
        url: '/aww-demo/IMG_1006.jpeg',
        name: 'Banner Image 1'
      },
      {
        id: '2',
        url: '/aww-demo/IMG_1019.jpeg',
        name: 'Banner Image 2'
      },
      {
        id: '3',
        url: '/aww-demo/IMG_0639.jpeg',
        name: 'Banner Image 3'
      },
      {
        id: '4',
        url: '/aww-demo/IMG_1427.jpeg',
        name: 'Banner Image 4'
      }
    ];
    setHeroImages(defaultImages);
    localStorage.setItem('aww_hero_images', JSON.stringify(defaultImages));
  }, []);

  const loadHeroImages = useCallback(() => {
    console.log('[AdminCMS] Loading hero images from localStorage');
    const stored = localStorage.getItem('aww_hero_images');
    console.log('[AdminCMS] Stored hero images:', stored ? 'found' : 'not found');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log('[AdminCMS] Parsed hero images:', parsed.length, 'images');
        setHeroImages(parsed);
      } catch (error) {
        console.error('[AdminCMS] Failed to parse hero images:', error);
        // Initialize with default images if parsing fails
        initializeDefaultHeroImages();
      }
    } else {
      // Initialize with default images
      console.log('[AdminCMS] No stored images, initializing defaults');
      initializeDefaultHeroImages();
    }
  }, [initializeDefaultHeroImages]);

  // Check for existing session on mount and when user changes
  useEffect(() => {
    const checkSession = async () => {
      console.log('[AdminCMS] Checking for existing session');
      
      // If user is logged in as admin through AuthContext, get proper admin token
      if (user?.email === 'admin@aww.com') {
        console.log('[AdminCMS] User logged in as admin via AuthContext, getting proper admin token');
        
        // Check if we already have a valid admin session token
        const storedAdminToken = localStorage.getItem('aww_admin_session_token');
        
        if (storedAdminToken) {
          console.log('[AdminCMS] Found stored admin session token, verifying...');
          try {
            const verifyResponse = await fetch(`${baseUrl}/admin/verify`, {
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
                'X-Admin-Token': storedAdminToken,
              },
            });

            if (verifyResponse.ok) {
              console.log('[AdminCMS] Admin session token is valid');
              setAdminToken(storedAdminToken);
              await loadEvents(storedAdminToken);
              loadHeroImages();
              setIsLoading(false);
              return;
            } else {
              console.log('[AdminCMS] Stored admin session token is invalid, getting new one');
              localStorage.removeItem('aww_admin_session_token');
            }
          } catch (error) {
            console.error('[AdminCMS] Error verifying admin token:', error);
            localStorage.removeItem('aww_admin_session_token');
          }
        }
        
        // Get a new admin session token
        console.log('[AdminCMS] Getting new admin session token');
        try {
          const loginResponse = await fetch(`${baseUrl}/admin/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              username: 'admin',
              password: 'AWW2025!Admin'
            }),
          });

          if (loginResponse.ok) {
            const loginData = await loginResponse.json();
            console.log('[AdminCMS] Got admin session token:', loginData.token ? 'present' : 'missing');
            const newToken = loginData.token;
            localStorage.setItem('aww_admin_session_token', newToken);
            setAdminToken(newToken);
            await loadEvents(newToken);
            loadHeroImages();
            setIsLoading(false);
            return;
          } else {
            console.error('[AdminCMS] Failed to get admin session token:', loginResponse.status);
            const errorText = await loginResponse.text();
            console.error('[AdminCMS] Admin login error:', errorText);
          }
        } catch (error) {
          console.error('[AdminCMS] Error during admin login:', error);
        }
        
        // Fallback to old method
        const storedToken = localStorage.getItem('admin-token-local') || 'admin-token';
        setAdminToken(storedToken);
        await loadEvents(storedToken);
        loadHeroImages();
        setIsLoading(false);
        return;
      }
      
      // Otherwise check for old admin token
      const storedToken = localStorage.getItem('aww_admin_token');
      
      if (!storedToken) {
        console.log('[AdminCMS] No stored token found');
        setIsLoading(false);
        return;
      }

      console.log('[AdminCMS] Found stored token, verifying with server');
      try {
        const response = await fetch(`${baseUrl}/admin/verify`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-Admin-Token': storedToken,
          },
        });

        if (response.ok) {
          console.log('[AdminCMS] Session verified successfully');
          setAdminToken(storedToken);
          await loadEvents(storedToken);
          loadHeroImages();
        } else {
          console.log('[AdminCMS] Session verification failed:', response.status);
          localStorage.removeItem('aww_admin_token');
        }
      } catch (error) {
        console.error('[AdminCMS] Error checking session:', error);
        localStorage.removeItem('aww_admin_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Only re-run when user changes

  const saveHeroImages = (images: any[]) => {
    localStorage.setItem('aww_hero_images', JSON.stringify(images));
    // Dispatch custom event to notify HomePage of changes
    window.dispatchEvent(new CustomEvent('heroImagesUpdated', { detail: images }));
    toast.success('Hero images updated successfully!');
  };

  const handleAddHeroImage = () => {
    if (!newHeroImage.url || !newHeroImage.name) {
      toast.error('Please provide an image and name');
      return;
    }

    const newImage = {
      id: Date.now().toString(),
      url: newHeroImage.url,
      name: newHeroImage.name
    };

    const updated = [...heroImages, newImage];
    setHeroImages(updated);
    saveHeroImages(updated);
    
    setNewHeroImage({ url: '', name: '' });
    setIsAddingHeroImage(false);
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setUploadingHeroImage(true);

    // Convert to data URL for immediate preview and storage
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      // Auto-generate name from filename or use generic name
      const fileName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
      setNewHeroImage({ 
        url: dataUrl,
        name: fileName || `Banner Image ${heroImages.length + 1}`
      });
      setUploadingHeroImage(false);
      toast.success('Image uploaded! Edit the name if needed.');
    };
    reader.onerror = () => {
      toast.error('Failed to upload image');
      setUploadingHeroImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteHeroImage = (imageId: string) => {
    if (!confirm('Are you sure you want to delete this hero image?')) return;
    
    const updated = heroImages.filter(img => img.id !== imageId);
    setHeroImages(updated);
    saveHeroImages(updated);
  };

  const handleReorderHeroImage = (imageId: string, direction: 'up' | 'down') => {
    const index = heroImages.findIndex(img => img.id === imageId);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= heroImages.length) return;
    
    const updated = [...heroImages];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setHeroImages(updated);
    saveHeroImages(updated);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !adminToken) return;

    setImageUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        const response = await fetch(`${baseUrl}/admin/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-Admin-Token': adminToken,
          },
          body: JSON.stringify({
            image: base64String,
            fileName: file.name,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setNewEvent({ ...newEvent, image: data.url });
          toast.success('Image uploaded successfully!');
        } else {
          console.error('Image upload error response:', data);
          console.error('Response status:', response.status);
          toast.error(data.error || 'Upload failed');
        }

        setImageUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
      setImageUploading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!adminToken) {
      console.error('No admin token available');
      toast.error('Not authenticated');
      return;
    }

    try {
      const speakersArray = newEvent.speakers
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const requestUrl = `${baseUrl}/admin/events`;
      console.log('Creating event, URL:', requestUrl);
      console.log('Admin token:', adminToken);
      console.log('Request payload:', { ...newEvent, speakers: speakersArray });

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Token': adminToken,
        },
        body: JSON.stringify({
          ...newEvent,
          speakers: speakersArray,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const data = await response.json();

      if (response.ok) {
        console.log('[AdminCMS] Event created successfully:', data.event);
        toast.success('Event created successfully!');
        
        // Reload events from server to ensure consistency
        await loadEvents(adminToken);
        
        setIsAddingEvent(false);
        // Reset form
        setNewEvent({
          title: '',
          date: '',
          time: '',
          location: '',
          address: '',
          category: 'Leadership',
          description: '',
          speakers: '',
          capacity: 100,
          price: 'Free',
          image: '',
          status: 'upcoming'
        });
      } else {
        console.error('Create event error response:', data);
        console.error('Response status:', response.status);
        console.error('Request body:', { ...newEvent, speakers: speakersArray });
        toast.error(data.error || 'Failed to create event');
      }
    } catch (error) {
      console.error('Create event error:', error);
      toast.error('Failed to create event: ' + error.message);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!adminToken || !confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`${baseUrl}/admin/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Token': adminToken,
        },
      });

      if (response.ok) {
        toast.success('Event deleted successfully!');
        setEvents(events.filter(e => e.id !== eventId));
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Delete event error:', error);
      toast.error('Failed to delete event');
    }
  };

  const handleMoveEvent = async (eventId: string, newStatus: 'upcoming' | 'past') => {
    if (!adminToken) {
      toast.error('Not authenticated');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/admin/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Token': adminToken,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        const statusText = newStatus === 'past' ? 'Past Events' : 'Upcoming Events';
        toast.success(`Event moved to ${statusText}!`);
        
        // Update local state
        setEvents(events.map(e => 
          e.id === eventId ? { ...e, status: newStatus } : e
        ));
      } else {
        toast.error(data.error || 'Failed to update event status');
      }
    } catch (error) {
      console.error('Move event error:', error);
      toast.error('Failed to update event status');
    }
  };

  console.log('[AdminCMS] Rendering - isLoading:', isLoading, 'user:', user?.email, 'events:', events.length);

  // Configuration check - moved after all hooks to comply with Rules of Hooks
  if (!projectId || !publicAnonKey) {
    console.error('[AdminCMS] Missing configuration - projectId:', projectId, 'publicAnonKey:', publicAnonKey ? 'present' : 'missing');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-red-600 mb-2">Configuration Error</h2>
              <p className="text-gray-600">Missing Supabase configuration. Please check your setup.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f7941D] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('[AdminCMS] Rendering admin dashboard');
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#f7941D] to-[#F79520] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white text-opacity-90 mt-1">A Woman's Worth Content Management System</p>
            </div>
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => {
                    if (onNavigateHome) {
                      onNavigateHome();
                    } else {
                      window.location.href = '/aww-demo/';
                    }
                  }}
                  variant="outline"
                  className="bg-white text-[#004080] hover:bg-gray-100"
                >
                  <Home size={16} className="mr-2" />
                  Return to Home
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={async () => {
                    if (onNavigateHome) {
                      onNavigateHome();
                    }
                    await authSignOut();
                  }}
                  variant="outline"
                  className="bg-white text-[#f7941D] hover:bg-gray-100"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <motion.button
              onClick={() => setActiveTab('events')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'events'
                  ? 'border-[#f7941D] text-[#f7941D]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="inline mr-2" size={18} />
              Event Management
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('hero')}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'hero'
                  ? 'border-[#f7941D] text-[#f7941D]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ImageIcon className="inline mr-2" size={18} />
              Hero Banner Images
            </motion.button>
          </nav>
        </div>

        {/* Tab Content - Events */}
        {activeTab === 'events' && (
          <>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-3xl font-bold text-gray-900">{events.length}</p>
                </div>
                <Calendar className="text-[#f7941D]" size={40} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming Events</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {events.filter(e => e && e.status === 'upcoming').length}
                  </p>
                </div>
                <Users className="text-[#004080]" size={40} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Past Events</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {events.filter(e => e && e.status === 'past').length}
                  </p>
                </div>
                <MapPin className="text-green-600" size={40} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Event Button & Fix Images Button */}
        <div className="mb-6 flex gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setIsAddingEvent(!isAddingEvent)}
              className="bg-[#f7941D] hover:bg-[#F79520] text-white"
            >
              {isAddingEvent ? <X size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
              {isAddingEvent ? 'Cancel' : 'Add New Event'}
            </Button>
          </motion.div>
        </div>

        {/* Add Event Form */}
        {isAddingEvent && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Create New Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Women in Leadership Summit"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={newEvent.category}
                      onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Leadership">Leadership</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Wellness">Wellness</SelectItem>
                        <SelectItem value="Career">Career</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Community">Community</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      placeholder="9:00 AM - 5:00 PM"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="Downtown Convention Center"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={newEvent.address}
                      onChange={(e) => setNewEvent({ ...newEvent, address: e.target.value })}
                      placeholder="123 Convention Ave, City, State"
                    />
                  </div>

                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={newEvent.capacity}
                      onChange={(e) => setNewEvent({ ...newEvent, capacity: parseInt(e.target.value) })}
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      value={newEvent.price}
                      onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
                      placeholder="Free or $25"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newEvent.status}
                      onValueChange={(value) => setNewEvent({ ...newEvent, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="past">Past</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="speakers">Speakers (comma-separated)</Label>
                    <Input
                      id="speakers"
                      value={newEvent.speakers}
                      onChange={(e) => setNewEvent({ ...newEvent, speakers: e.target.value })}
                      placeholder="Dr. Sarah Johnson, Maria Rodriguez"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Join us for a full day of inspiring talks..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="image">Event Image</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <label className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <Upload size={16} className="mr-2" />
                        {imageUploading ? 'Uploading...' : 'Upload Image'}
                        <input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={imageUploading}
                        />
                      </label>
                      {newEvent.image && (
                        <div className="flex items-center gap-2">
                          <ImageIcon size={16} className="text-green-600" />
                          <span className="text-sm text-green-600">Image uploaded</span>
                        </div>
                      )}
                    </div>
                    {newEvent.image && (
                      <div className="mt-4 max-w-md">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                          <ImageWithFallback
                            src={newEvent.image}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddingEvent(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateEvent}
                    className="bg-[#f7941D] hover:bg-[#F79520] text-white"
                  >
                    <Save size={16} className="mr-2" />
                    Create Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Upcoming Events Section */}
        <div className="space-y-4 mb-12">
          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-lg border-l-4 border-[#004080]">
            <div className="bg-[#004080] p-2 rounded-lg">
              <Calendar className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#004080]">Upcoming Events</h2>
              <p className="text-sm text-gray-600">Events scheduled for the future</p>
            </div>
            <Badge className="bg-[#004080] text-white ml-auto text-lg px-3 py-1">
              {events.filter(e => e && e.status === 'upcoming').length}
            </Badge>
          </div>
          {events.filter(e => e && e.status === 'upcoming').length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No upcoming events. Create one above!</p>
              </CardContent>
            </Card>
          ) : (
            events.filter(e => e && e.status === 'upcoming').map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {event.image && (
                      <div className="w-48 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <ImageWithFallback
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                            <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                              {event.status}
                            </Badge>
                            <Badge variant="outline">{event.category}</Badge>
                          </div>
                          <p className="text-gray-600 mb-4">{event.description}</p>
                        </div>
                        <div className="flex gap-2">
                          {event.status === 'upcoming' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMoveEvent(event.id, 'past')}
                              className="text-blue-600 hover:bg-blue-50"
                              title="Move to Past Events"
                            >
                              <Archive size={16} />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMoveEvent(event.id, 'upcoming')}
                              className="text-green-600 hover:bg-green-50"
                              title="Move to Upcoming Events"
                            >
                              <ArchiveRestore size={16} />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600 hover:bg-red-50"
                            title="Delete Event"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar size={14} className="mr-2" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin size={14} className="mr-2" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users size={14} className="mr-2" />
                          {event.capacity} capacity
                        </div>
                        <div className="flex items-center text-gray-600">
                          <DollarSign size={14} className="mr-2" />
                          {event.price}
                        </div>
                      </div>
                      {event.speakers && Array.isArray(event.speakers) && event.speakers.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm text-gray-500 mr-2">Speakers:</span>
                          {event.speakers.map((speaker: string, idx: number) => (
                            <span key={idx} className="text-sm bg-gray-100 px-2 py-1 rounded mr-2">
                              {speaker}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))
          )}
        </div>

        {/* Past Events Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-gradient-to-r from-gray-100 to-transparent p-4 rounded-lg border-l-4 border-gray-400">
            <div className="bg-gray-500 p-2 rounded-lg">
              <Archive className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-700">Past Events</h2>
              <p className="text-sm text-gray-600">Events that have already happened</p>
            </div>
            <Badge className="bg-gray-500 text-white ml-auto text-lg px-3 py-1">
              {events.filter(e => e && e.status === 'past').length}
            </Badge>
          </div>
          {events.filter(e => e && e.status === 'past').length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Archive size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No past events yet.</p>
              </CardContent>
            </Card>
          ) : (
            events.filter(e => e && e.status === 'past').map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-6">
                    {event.image && (
                      <div className="w-48 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <ImageWithFallback
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                            <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                              {event.status}
                            </Badge>
                            <Badge variant="outline">{event.category}</Badge>
                          </div>
                          <p className="text-gray-600 mb-4">{event.description}</p>
                        </div>
                        <div className="flex gap-2">
                          {event.status === 'upcoming' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMoveEvent(event.id, 'past')}
                              className="text-blue-600 hover:bg-blue-50"
                              title="Move to Past Events"
                            >
                              <Archive size={16} />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMoveEvent(event.id, 'upcoming')}
                              className="text-green-600 hover:bg-green-50"
                              title="Move to Upcoming Events"
                            >
                              <ArchiveRestore size={16} />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600 hover:bg-red-50"
                            title="Delete Event"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar size={14} className="mr-2" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin size={14} className="mr-2" />
                          {event.location}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users size={14} className="mr-2" />
                          {event.capacity} capacity
                        </div>
                        <div className="flex items-center text-gray-600">
                          <DollarSign size={14} className="mr-2" />
                          {event.price}
                        </div>
                      </div>
                      {event.speakers && Array.isArray(event.speakers) && event.speakers.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm text-gray-500 mr-2">Speakers:</span>
                          {event.speakers.map((speaker: string, idx: number) => (
                            <span key={idx} className="text-sm bg-gray-100 px-2 py-1 rounded mr-2">
                              {speaker}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
          </>
        )}

        {/* Tab Content - Hero Images */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            {/* Hero Images Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Hero Banner Images</h2>
                <p className="text-gray-600 mt-1">Manage the rotating images on the homepage hero section</p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => setIsAddingHeroImage(true)}
                  className="bg-[#f7941D] hover:bg-[#F79520]"
                >
                  <Plus size={16} className="mr-2" />
                  Add Image
                </Button>
              </motion.div>
            </div>

            {/* Add New Hero Image Form */}
            {isAddingHeroImage && (
              <Card className="border-[#f7941D] border-2">
                <CardHeader className="bg-gradient-to-r from-[#f7941D]/10 to-[#F79520]/10">
                  <div className="flex items-center justify-between">
                    <CardTitle>Add New Hero Image</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsAddingHeroImage(false);
                        setNewHeroImage({ url: '', name: '' });
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Simple File Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Image</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Click below to select an image from your computer
                      </p>
                      <input
                        type="file"
                        id="heroImageUpload"
                        accept="image/*"
                        onChange={handleHeroImageUpload}
                        className="hidden"
                      />
                      <Button
                        onClick={() => document.getElementById('heroImageUpload')?.click()}
                        disabled={uploadingHeroImage}
                        className="bg-[#f7941D] hover:bg-[#F79520]"
                      >
                        {uploadingHeroImage ? (
                          <>
                            <Upload className="mr-2 animate-spin" size={16} />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload size={16} className="mr-2" />
                            Choose Image
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Preview and Details */}
                    {newHeroImage.url && (
                      <>
                        <div>
                          <Label className="text-base font-semibold">Preview</Label>
                          <div className="mt-2 relative h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                            <img
                              src={newHeroImage.url}
                              alt={newHeroImage.name || 'Preview'}
                              className="w-full h-full object-cover object-center"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="heroImageName" className="text-base font-semibold">
                            Banner Image Name
                          </Label>
                          <Input
                            id="heroImageName"
                            placeholder="e.g., Conference 2024"
                            value={newHeroImage.name}
                            onChange={(e) => setNewHeroImage({ ...newHeroImage, name: e.target.value })}
                            className="mt-2"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Give this image a simple name to identify it
                          </p>
                        </div>

                        <div className="flex gap-2 pt-4 border-t">
                          <Button
                            onClick={handleAddHeroImage}
                            disabled={!newHeroImage.name}
                            className="bg-[#f7941D] hover:bg-[#F79520]"
                          >
                            <Save size={16} className="mr-2" />
                            Add to Banner
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsAddingHeroImage(false);
                              setNewHeroImage({ url: '', name: '' });
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hero Images List - Vertical Layout */}
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Display Order:</strong> Images are shown in the order below. Use ↑↓ buttons to reorder.
                  The first image will appear first in the rotation.
                </p>
              </div>

              {heroImages.map((image, index) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* Order Number - Prominent */}
                    <div className="md:w-20 bg-gradient-to-br from-[#f7941D] to-[#F79520] flex items-center justify-center p-4">
                      <div className="text-center text-white">
                        <div className="text-3xl font-bold">#{index + 1}</div>
                        <div className="text-xs mt-1 opacity-90">
                          {index === 0 ? 'FIRST' : index === heroImages.length - 1 ? 'LAST' : `#${index + 1}`}
                        </div>
                      </div>
                    </div>

                    {/* Image Preview */}
                    <div className="md:w-60 relative h-32 bg-gray-100">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    {/* Details and Actions */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{image.name}</h3>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReorderHeroImage(image.id, 'up')}
                          disabled={index === 0}
                          title="Move Up (Show Earlier)"
                          className="flex-1"
                        >
                          <span className="text-lg mr-1">↑</span> Move Up
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReorderHeroImage(image.id, 'down')}
                          disabled={index === heroImages.length - 1}
                          title="Move Down (Show Later)"
                          className="flex-1"
                        >
                          <span className="text-lg mr-1">↓</span> Move Down
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteHeroImage(image.id)}
                          className="text-red-600 hover:bg-red-50"
                          title="Delete Image"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {heroImages.length === 0 && (
              <Card className="p-12 text-center">
                <ImageIcon className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Hero Images</h3>
                <p className="text-gray-600 mb-4">Add your first hero banner image to get started</p>
                <Button
                  onClick={() => setIsAddingHeroImage(true)}
                  className="bg-[#f7941D] hover:bg-[#F79520]"
                >
                  <Plus size={16} className="mr-2" />
                  Add First Image
                </Button>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
