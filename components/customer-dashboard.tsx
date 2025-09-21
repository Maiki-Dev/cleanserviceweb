
"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  LogOut, 
  Home, 
  Building2,
  CreditCard,
  Phone,
  Mail,
  Plus,
  Eye,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { BookingWithDetails, ServiceWithBookings, UserWithRole } from "@/lib/types";
import { format } from "date-fns";
import { mn } from "date-fns/locale";

interface CustomerDashboardProps {
  user: UserWithRole;
}

const services = [
  {
    id: "home-cleaning",
    name: "Гэрийн цэвэрлэгээ",
    nameEn: "Home Cleaning",
    description: "Таны гэрийг гялалзуулж, эрүүл ахуйн стандартыг дээшлүүлье",
    type: "HOME_CLEANING",
    basePrice: 25000,
    duration: 120,
    icon: Home,
    features: ["Ерөнхий цэвэрлэгээ", "Ариутгал", "Шал угаалга", "Тоос арилгах"],
  },
  {
    id: "office-cleaning",
    name: "Оффисын цэвэрлэгээ",
    nameEn: "Office Cleaning",
    description: "Таны ажлын орчинд мэргэжлийн цэвэрлэгээний үйлчилгээ",
    type: "OFFICE_CLEANING",
    basePrice: 45000,
    duration: 180,
    icon: Building2,
    features: ["Ширээ, сандал", "Электроник төхөөрөмж", "Шал угаалга", "Хогийн сав"],
  },
];

export default function CustomerDashboard({ user }: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState("book");
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    serviceId: "",
    scheduledAt: "",
    address: "",
    specialInstructions: "",
  });

  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings");
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingForm.serviceId || !bookingForm.scheduledAt || !bookingForm.address) {
      toast.error("Заавал бөглөх талбаруудыг бөглөнө үү");
      return;
    }

    const selectedService = services.find(s => s.id === bookingForm.serviceId);
    if (!selectedService) {
      toast.error("Үйлчилгээг сонгоно уу");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...bookingForm,
          serviceType: selectedService.type,
          serviceName: selectedService.name,
          totalPrice: selectedService.basePrice,
          duration: selectedService.duration,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Захиалга амжилттай үүслээ!");
        setBookingForm({
          serviceId: "",
          scheduledAt: "",
          address: "",
          specialInstructions: "",
        });
        setActiveTab("bookings");
        fetchBookings();
      } else {
        toast.error(data.error || "Алдаа гарлаа");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (bookingId: string, amount: number) => {
    toast.info("Төлбөрийн систем удахгүй нэмэгдэнэ");
    // TODO: Implement payment functionality
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      PENDING: { label: "Хүлээж байна", variant: "secondary" as const },
      CONFIRMED: { label: "Баталгаажсан", variant: "default" as const },
      IN_PROGRESS: { label: "Гүйцэтгэж байна", variant: "default" as const },
      COMPLETED: { label: "Дууссан", variant: "secondary" as const },
      CANCELLED: { label: "Цуцлагдсан", variant: "destructive" as const },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap];
    return (
      <Badge variant={statusInfo?.variant}>
        {statusInfo?.label || status}
      </Badge>
    );
  };

  const formatDate = (date: string | Date) => {
    try {
      return format(new Date(date), "PPP p", { locale: mn });
    } catch {
      return "Тодорхойгүй";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">CleanPro</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Button
                variant={activeTab === "book" ? "default" : "ghost"}
                onClick={() => setActiveTab("book")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Захиалах
              </Button>
              <Button
                variant={activeTab === "bookings" ? "default" : "ghost"}
                onClick={() => setActiveTab("bookings")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Миний захиалга
              </Button>
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                onClick={() => setActiveTab("profile")}
              >
                <User className="w-4 h-4 mr-2" />
                Профайл
              </Button>
            </nav>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground hidden sm:block">
                Сайн уу, {user?.name || user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Mobile Navigation */}
        <div className="md:hidden mb-6">
          <div className="flex space-x-2">
            <Button
              variant={activeTab === "book" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("book")}
              className="flex-1"
            >
              Захиалах
            </Button>
            <Button
              variant={activeTab === "bookings" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("bookings")}
              className="flex-1"
            >
              Захиалга
            </Button>
            <Button
              variant={activeTab === "profile" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("profile")}
              className="flex-1"
            >
              Профайл
            </Button>
          </div>
        </div>

        {/* Book Service Tab */}
        {activeTab === "book" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Үйлчилгээ захиалах</h1>
              <p className="text-xl text-muted-foreground">
                Та хүссэн үйлчилгээгээ сонгоод захиална уу
              </p>
            </div>

            {/* Service Selection */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all hover-lift ${
                      bookingForm.serviceId === service.id ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setBookingForm({...bookingForm, serviceId: service.id})}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <service.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{service.name}</CardTitle>
                          <CardDescription>{service.nameEn}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {service.description}
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-2xl font-bold text-primary">
                          {service.basePrice.toLocaleString()}₮
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {Math.floor(service.duration / 60)} цаг
                        </div>
                      </div>
                      <ul className="space-y-1 text-sm">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <div className="w-1 h-1 bg-primary rounded-full mr-3" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Booking Form */}
            {bookingForm.serviceId && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Захиалгын мэдээлэл
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="scheduledAt">Огноо ба цаг *</Label>
                          <Input
                            id="scheduledAt"
                            type="datetime-local"
                            value={bookingForm.scheduledAt}
                            onChange={(e) => setBookingForm({...bookingForm, scheduledAt: e.target.value})}
                            min={new Date().toISOString().slice(0, 16)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Хаяг *</Label>
                        <Textarea
                          id="address"
                          placeholder="Цэвэрлэх газрын дэлгэрэнгүй хаягийг оруулна уу"
                          value={bookingForm.address}
                          onChange={(e) => setBookingForm({...bookingForm, address: e.target.value})}
                          className="min-h-20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialInstructions">Нэмэлт тэмдэглэл</Label>
                        <Textarea
                          id="specialInstructions"
                          placeholder="Тусгай анхаарах зүйл байвал энд бичнэ үү"
                          value={bookingForm.specialInstructions}
                          onChange={(e) => setBookingForm({...bookingForm, specialInstructions: e.target.value})}
                          className="min-h-20"
                        />
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Захиалж байна..." : "Захиалах"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* My Bookings Tab */}
        {activeTab === "bookings" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Миний захиалга</h1>
              <p className="text-xl text-muted-foreground">
                Таны хийсэн захиалгуудын жагсаалт
              </p>
            </div>

            <div className="space-y-6">
              {bookings.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Захиалга байхгүй</h3>
                    <p className="text-muted-foreground mb-4">
                      Та одоогоор захиалга хийгээгүй байна.
                    </p>
                    <Button onClick={() => setActiveTab("book")}>
                      <Plus className="w-4 h-4 mr-2" />
                      Үйлчилгээ захиалах
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card key={booking.id} className="hover-lift">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center">
                            {booking.service.type === "HOME_CLEANING" ? (
                              <Home className="w-5 h-5 mr-2" />
                            ) : (
                              <Building2 className="w-5 h-5 mr-2" />
                            )}
                            {booking.service.name}
                          </CardTitle>
                          <CardDescription>
                            Захиалсан: {formatDate(booking.createdAt)}
                          </CardDescription>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                            <span>{formatDate(booking.scheduledAt)}</span>
                          </div>
                          <div className="flex items-start text-sm">
                            <MapPin className="w-4 h-4 mr-2 mt-1 text-muted-foreground flex-shrink-0" />
                            <span>{booking.address}</span>
                          </div>
                          {booking.specialInstructions && (
                            <div className="text-sm text-muted-foreground">
                              <strong>Тэмдэглэл:</strong> {booking.specialInstructions}
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <div className="text-2xl font-bold text-primary">
                            {booking.totalPrice.toLocaleString()}₮
                          </div>
                          {booking.cleaner && (
                            <div className="text-sm text-muted-foreground">
                              <strong>Цэвэрлэгч:</strong> {booking.cleaner.fullName}
                            </div>
                          )}
                          <div className="flex gap-2">
                            {booking.status === "PENDING" && (
                              <Button 
                                size="sm" 
                                onClick={() => handlePayment(booking.id, booking.totalPrice * 0.5)}
                              >
                                <CreditCard className="w-4 h-4 mr-2" />
                                Төлбөр (50%)
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Миний профайл</h1>
              <p className="text-xl text-muted-foreground">
                Таны хувийн мэдээлэл
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Хувийн мэдээлэл
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Овог нэр</Label>
                      <div className="text-lg font-medium">{user?.name || "Тодорхойгүй"}</div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Хэрэглэгчийн төрөл</Label>
                      <div className="text-lg font-medium">Үйлчлүүлэгч</div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        Имэйл хаяг
                      </Label>
                      <div className="text-lg font-medium">{user?.email}</div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        Утасны дугаар
                      </Label>
                      <div className="text-lg font-medium">{user.phone || "Тодорхойгүй"}</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline" className="flex-1">
                        Мэдээлэл засах
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Нууц үг солих
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
