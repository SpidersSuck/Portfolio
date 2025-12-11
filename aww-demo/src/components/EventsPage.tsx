import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Camera, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface EventsPageProps {
  onPageChange: (page: string) => void;
}

export function EventsPage({ onPageChange }: EventsPageProps) {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-27ffc17a`;

  // Fetch events function
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      console.log('[EventsPage] Fetching events from:', `${baseUrl}/events`);
      const response = await fetch(`${baseUrl}/events`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      console.log('[EventsPage] Events response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('[EventsPage] Events data received:', data);
        console.log('[EventsPage] Raw events:', JSON.stringify(data.events, null, 2));
        
        // Ensure events is an array and filter out null values
        const eventsArray = Array.isArray(data.events) ? data.events.filter(e => e !== null && e !== undefined) : [];
        console.log('[EventsPage] Filtered events array length:', eventsArray.length);
        console.log('[EventsPage] Events:', eventsArray);
        setEvents(eventsArray);
        setError(null);
      } else {
        const errorText = await response.text();
        console.error('[EventsPage] Failed to fetch events:', response.status, errorText);
        setError(`Failed to load events: ${response.status}`);
      }
    } catch (error) {
      console.error('[EventsPage] Error fetching events:', error);
      setError(`Error loading events: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fallback events if database is empty
  const fallbackEvents = [
    {
      id: 1,
      title: "Women in Leadership Summit",
      date: "2025-03-15",
      time: "9:00 AM - 5:00 PM",
      location: "Downtown Convention Center",
      address: "123 Convention Ave, City, State",
      category: "Leadership",
      description: "Join us for a full day of inspiring talks, networking, and workshops focused on developing leadership skills and advancing women in leadership positions.",
      speakers: ["Dr. Sarah Johnson", "Maria Rodriguez", "Jennifer Chen"],
      capacity: 200,
      registered: 156,
      price: "Free",
      image: "https://images.unsplash.com/photo-1693893217892-0517da6a46f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHdvcmtzaG9wJTIwY29uZmVyZW5jZXxlbnwxfHx8fDE3NTk3ODYzODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      status: "upcoming"
    },
    {
      id: 2,
      title: "Entrepreneurship Workshop",
      date: "2025-03-22",
      time: "2:00 PM - 6:00 PM",
      location: "Business Innovation Hub",
      address: "456 Innovation Dr, City, State",
      category: "Business",
      description: "Learn the essentials of starting and growing your own business. This hands-on workshop covers business planning, funding, marketing, and more.",
      speakers: ["Lisa Thompson", "Amanda Foster"],
      capacity: 50,
      registered: 23,
      price: "$25",
      image: "https://images.unsplash.com/photo-1646369505567-3a9cbb052342?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnNwaXJhdGlvbmFsJTIwd29tYW4lMjBzcGVha2luZ3xlbnwxfHx8fDE3NTk3ODYzODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Wellness & Self-Care Retreat",
      date: "2025-04-05",
      time: "10:00 AM - 4:00 PM",
      location: "Serenity Wellness Center",
      address: "789 Peaceful Ln, City, State",
      category: "Wellness",
      description: "Take time to focus on your well-being with mindfulness sessions, yoga, nutrition workshops, and stress management techniques.",
      speakers: ["Dr. Michelle Parker", "Yoga Instructor Jane"],
      capacity: 30,
      registered: 18,
      price: "$45",
      image: "https://images.unsplash.com/photo-1611331023516-6ec931575ecc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNlbGVicmF0aW5nJTIwc3VjY2Vzc3xlbnwxfHx8fDE3NTk3ODYzMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      status: "upcoming"
    },
    {
      id: 4,
      title: "Career Transition Bootcamp",
      date: "2025-04-12",
      time: "9:00 AM - 3:00 PM",
      location: "Professional Development Center",
      address: "321 Career St, City, State",
      category: "Career",
      description: "Whether you're changing industries or advancing in your current field, this bootcamp provides tools and strategies for successful career transitions.",
      speakers: ["Career Coach Sarah", "HR Director Mike"],
      capacity: 75,
      registered: 45,
      price: "$35",
      image: "https://images.unsplash.com/photo-1587579919988-e2ba60d91283?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXBvd2VyZWQlMjB3b21lbiUyMGxlYWRlcnNoaXB8ZW58MXx8fHwxNzU5Nzg2MzIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      status: "upcoming"
    },
    {
      id: 5,
      title: "Financial Literacy Workshop",
      date: "2025-02-20",
      time: "6:00 PM - 8:00 PM",
      location: "Community Learning Center",
      address: "654 Education Blvd, City, State",
      category: "Finance",
      description: "Build financial confidence with practical workshops on budgeting, investing, and planning for your financial future.",
      speakers: ["Financial Advisor Rachel"],
      capacity: 40,
      registered: 40,
      price: "Free",
      image: "https://images.unsplash.com/photo-1676629650907-d50f2f27db20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGNvbW11bml0eSUyMHN1cHBvcnR8ZW58MXx8fHwxNzU5Nzg2MzIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      status: "past"
    }
  ];

  // Use database events if available, otherwise use fallback
  const displayEvents = events.length > 0 ? events : fallbackEvents;
  const usingDatabaseEvents = events.length > 0;
  console.log('[EventsPage] Display events:', displayEvents.length, 'DB events:', events.length, 'Fallback:', fallbackEvents.length);
  console.log('[EventsPage] Using database events:', usingDatabaseEvents);
  
  // Add safety checks for events that might not have a status field
  const upcomingEvents = displayEvents.filter(event => {
    if (!event) return false;
    const status = event.status || 'upcoming';
    return status === 'upcoming';
  });
  
  const pastEvents = displayEvents.filter(event => {
    if (!event) return false;
    const status = event.status || 'upcoming';
    return status === 'past';
  });
  
  console.log('[EventsPage] Upcoming events:', upcomingEvents.length, 'Past events:', pastEvents.length);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date TBD';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date TBD';
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Date TBD';
    }
  };

  const handleRegister = (event: any) => {
    alert(`Registration for "${event.title}" initiated! You would be redirected to the registration form.`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f7941D] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('[EventsPage] Rendering error state:', error);
  }

  try {
    console.log('[EventsPage] Rendering. Events count:', events.length, 'Upcoming:', upcomingEvents.length, 'Past:', pastEvents.length);
  } catch (renderError) {
    console.error('[EventsPage] Error during render preparation:', renderError);
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading events page. Please refresh.</p>
          <p className="text-sm mt-2">{renderError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#004080] to-[#003066] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold text-white mb-6"
          >
            Events & Workshops
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white text-opacity-90 mb-8 max-w-3xl mx-auto"
          >
            Join us for inspiring events, educational workshops, and networking opportunities designed to empower and connect women.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-4 justify-center"
          >
            <Button 
              onClick={() => onPageChange('event-gallery')}
              className="bg-[#f7941D] hover:bg-[#F79520] text-white px-6 py-3 rounded-full transition-all duration-200 hover:scale-105"
            >
              <Camera className="mr-2" size={20} />
              Event Gallery
            </Button>
            <Button 
              onClick={fetchEvents}
              variant="outline"
              className="bg-white text-[#004080] border-white hover:bg-gray-100 px-6 py-3 rounded-full transition-all duration-200 hover:scale-105"
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} size={20} />
              Refresh Events
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Events Tabs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Status indicator */}
          {usingDatabaseEvents && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 text-center">
              ✓ Displaying {events.length} event{events.length !== 1 ? 's' : ''} from database
            </div>
          )}
          {!usingDatabaseEvents && !isLoading && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 text-center">
              ℹ️ Displaying sample events (no events in database yet)
            </div>
          )}
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingEvents && upcomingEvents.length > 0 ? (
              <div className="space-y-8">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="md:flex">
                        <div className="md:w-1/3">
                          <div className="aspect-video md:aspect-square overflow-hidden bg-gray-100">
                            <ImageWithFallback
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                        <CardContent className="md:w-2/3 p-6">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge variant="secondary" className="bg-[#f7941D] text-white">
                              {event.category}
                            </Badge>
                            <Badge variant="outline">
                              {event.price}
                            </Badge>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h3>
                          <p className="text-gray-600 mb-4">{event.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="flex items-center text-gray-600">
                                <Calendar size={16} className="mr-2" />
                                <span>{formatDate(event.date)}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock size={16} className="mr-2" />
                                <span>{event.time}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center text-gray-600">
                                <MapPin size={16} className="mr-2" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Users size={16} className="mr-2" />
                                <span>{event.registered || 0}/{event.capacity} registered</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {event.speakers && event.speakers.map((speaker: string, idx: number) => (
                                <span key={idx} className="text-sm bg-gray-100 px-2 py-1 rounded">
                                  {speaker}
                                </span>
                              ))}
                            </div>
                            <div className="space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => setSelectedEvent(event)}
                                className="border-[#004080] text-[#004080] hover:bg-[#004080] hover:text-white"
                              >
                                Learn More
                              </Button>
                              <Button
                                onClick={() => handleRegister(event)}
                                className="bg-[#f7941D] hover:bg-[#F79520] text-white"
                                disabled={(event.registered || 0) >= event.capacity}
                              >
                                {(event.registered || 0) >= event.capacity ? 'Full' : 'Register'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No upcoming events at this time. Check back soon!
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {pastEvents && pastEvents.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                      <div className="aspect-video overflow-hidden bg-gray-100">
                        <ImageWithFallback
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="bg-gray-500 text-white">
                            {event.category}
                          </Badge>
                          <Badge variant="outline" className="text-gray-500">
                            Past Event
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-600">
                            <Calendar size={14} className="mr-2" />
                            <span className="text-sm">{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin size={14} className="mr-2" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => onPageChange('event-gallery')}
                          className="text-[#f7941D] hover:text-[#F79520] font-medium inline-flex items-center"
                        >
                          View Photos <ArrowRight className="ml-1" size={16} />
                        </button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No past events to display.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="aspect-video overflow-hidden rounded-lg mb-4 bg-gray-100">
                <ImageWithFallback
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-4">
                <p className="text-gray-600">{selectedEvent.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Event Details</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2" />
                        {formatDate(selectedEvent.date)}
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-2" />
                        {selectedEvent.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-2" />
                        {selectedEvent.location}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Speakers</h4>
                    <div className="space-y-1">
                      {selectedEvent.speakers && selectedEvent.speakers.map((speaker: string, idx: number) => (
                        <div key={idx} className="text-sm text-gray-600">{speaker}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedEvent(null)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => handleRegister(selectedEvent)}
                    className="bg-[#f7941D] hover:bg-[#F79520] text-white"
                  >
                    Register Now
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
