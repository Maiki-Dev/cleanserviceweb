
"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Shield, 
  Calendar, 
  Users, 
  LogOut, 
  Search,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Clock,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { BookingWithDetails, UserWithRole } from "@/lib/types";
import { format } from "date-fns";
import { mn } from "date-fns/locale";

interface AdminDashboardProps {
  user: UserWithRole;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingWithDetails[]>([]);
  const [cleaners, setCleaners] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const fetchData = async () => {
    try {
      // Fetch bookings
      const bookingsResponse = await fetch("/api/bookings");
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      }

      // Fetch users
      const usersResponse = await fetch("/api/users");
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setCleaners(usersData.filter((u: any) => u.role === "CLEANER"));
        setCustomers(usersData.filter((u: any) => u.role === "CUSTOMER"));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success("Захиалгын төлөв амжилттай шинэчлэгдлээ");
        fetchData();
      } else {
        toast.error("Алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error("Алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  const assignCleaner = async (bookingId: string, cleanerId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cleanerId }),
      });

      if (response.ok) {
        toast.success("Цэвэрлэгч амжилттай томилогдлоо");
        fetchData();
      } else {
        toast.error("Алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error assigning cleaner:", error);
      toast.error("Алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBooking = async (bookingId: string) => {
    if (!confirm("Энэ захиалгыг устгахдаа итгэлтэй байна уу?")) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Захиалга амжилттай устгагдлаа");
        fetchData();
      } else {
        toast.error("Алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
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

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === "PENDING").length,
    completedBookings: bookings.filter(b => b.status === "COMPLETED").length,
    totalRevenue: bookings
      .filter(b => b.status === "COMPLETED")
      .reduce((sum, b) => sum + b.totalPrice, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <span className="text-2xl font-bold">Admin Panel</span>
                <div className="text-sm text-muted-foreground">CleanPro Management</div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Button
                variant={activeTab === "bookings" ? "default" : "ghost"}
                onClick={() => setActiveTab("bookings")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Захиалга
              </Button>
              <Button
                variant={activeTab === "users" ? "default" : "ghost"}
                onClick={() => setActiveTab("users")}
              >
                <Users className="w-4 h-4 mr-2" />
                Хэрэглэгч
              </Button>
            </nav>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground hidden sm:block">
                Админ: {user?.name || user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Нийт захиалга
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Хүлээж буй
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Дууссан
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedBookings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Нийт орлого
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {stats.totalRevenue.toLocaleString()}₮
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Management */}
        {activeTab === "bookings" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Захиалга удирдах
                </CardTitle>
                <CardDescription>
                  Захиалгын төлөв болон цэвэрлэгч томилох
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Хайх..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Төлөв сонгох" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Бүх төлөв</SelectItem>
                      <SelectItem value="PENDING">Хүлээж байна</SelectItem>
                      <SelectItem value="CONFIRMED">Баталгаажсан</SelectItem>
                      <SelectItem value="IN_PROGRESS">Гүйцэтгэж байна</SelectItem>
                      <SelectItem value="COMPLETED">Дууссан</SelectItem>
                      <SelectItem value="CANCELLED">Цуцлагдсан</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                  {filteredBookings.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Захиалга олдсонгүй
                    </div>
                  ) : (
                    filteredBookings.map((booking) => (
                      <Card key={booking.id} className="border-l-4 border-l-primary/20">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">
                                {booking.service.name}
                              </CardTitle>
                              <CardDescription>
                                Захиалагч: {booking.customer?.fullName} - {booking.customer?.email}
                              </CardDescription>
                            </div>
                            {getStatusBadge(booking.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid lg:grid-cols-3 gap-4">
                            {/* Booking Details */}
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                                <span>{formatDate(booking.scheduledAt)}</span>
                              </div>
                              <div className="flex items-start text-sm">
                                <MapPin className="w-4 h-4 mr-2 mt-1 text-muted-foreground flex-shrink-0" />
                                <span>{booking.address}</span>
                              </div>
                              {booking.customer?.phone && (
                                <div className="flex items-center text-sm">
                                  <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                                  <span>{booking.customer.phone}</span>
                                </div>
                              )}
                              <div className="text-lg font-semibold text-primary">
                                {booking.totalPrice.toLocaleString()}₮
                              </div>
                            </div>

                            {/* Cleaner Assignment */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Цэвэрлэгч томилох</Label>
                              {booking.cleaner ? (
                                <div className="flex items-center text-sm">
                                  <UserCheck className="w-4 h-4 mr-2 text-green-600" />
                                  <span>{booking.cleaner.fullName}</span>
                                </div>
                              ) : (
                                <Select
                                  value={booking.cleanerId || ""}
                                  onValueChange={(value) => assignCleaner(booking.id, value)}
                                  disabled={isLoading}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Цэвэрлэгч сонгох" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {cleaners.map((cleaner) => (
                                      <SelectItem key={cleaner.id} value={cleaner.id}>
                                        {cleaner.fullName}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Үйлдэл</Label>
                              <div className="flex flex-col gap-2">
                                <Select
                                  value={booking.status}
                                  onValueChange={(value) => updateBookingStatus(booking.id, value)}
                                  disabled={isLoading}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="PENDING">Хүлээж байна</SelectItem>
                                    <SelectItem value="CONFIRMED">Баталгаажуулах</SelectItem>
                                    <SelectItem value="IN_PROGRESS">Эхлүүлэх</SelectItem>
                                    <SelectItem value="COMPLETED">Дуусгах</SelectItem>
                                    <SelectItem value="CANCELLED">Цуцлах</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteBooking(booking.id)}
                                  disabled={isLoading}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Устгах
                                </Button>
                              </div>
                            </div>
                          </div>

                          {booking.specialInstructions && (
                            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm">
                                <strong>Тэмдэглэл:</strong> {booking.specialInstructions}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Users Management */}
        {activeTab === "users" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Cleaners */}
            <Card>
              <CardHeader>
                <CardTitle>Цэвэрлэгчид ({cleaners.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cleaners.map((cleaner) => (
                    <div key={cleaner.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{cleaner.fullName}</p>
                        <p className="text-sm text-muted-foreground">{cleaner.email}</p>
                        {cleaner.phone && (
                          <p className="text-sm text-muted-foreground">{cleaner.phone}</p>
                        )}
                      </div>
                      <Badge variant={cleaner.isActive ? "default" : "secondary"}>
                        {cleaner.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                      </Badge>
                    </div>
                  ))}
                  {cleaners.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Цэвэрлэгч байхгүй
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customers */}
            <Card>
              <CardHeader>
                <CardTitle>Үйлчлүүлэгчид ({customers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customers.slice(0, 10).map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{customer.fullName}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                        {customer.phone && (
                          <p className="text-sm text-muted-foreground">{customer.phone}</p>
                        )}
                      </div>
                      <Badge variant={customer.isActive ? "default" : "secondary"}>
                        {customer.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                      </Badge>
                    </div>
                  ))}
                  {customers.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      Үйлчлүүлэгч байхгүй
                    </p>
                  )}
                  {customers.length > 10 && (
                    <p className="text-center text-sm text-muted-foreground">
                      ...болон өөр {customers.length - 10} үйлчлүүлэгч
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
