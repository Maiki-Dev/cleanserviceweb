
"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wrench, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  LogOut, 
  User,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { BookingWithDetails, UserWithRole } from "@/lib/types";
import { format } from "date-fns";
import { mn } from "date-fns/locale";

interface CleanerDashboardProps {
  user: UserWithRole;
}

export default function CleanerDashboard({ user }: CleanerDashboardProps) {
  const [activeTab, setActiveTab] = useState("assignments");
  const [assignments, setAssignments] = useState<BookingWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch("/api/bookings");
      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/cleaner/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success("Төлөв амжилттай шинэчлэгдлээ");
        fetchAssignments();
      } else {
        toast.error("Алдаа гарлаа");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      PENDING: { label: "Хүлээж байна", variant: "secondary" as const, icon: AlertCircle },
      CONFIRMED: { label: "Баталгаажсан", variant: "default" as const, icon: CheckCircle },
      IN_PROGRESS: { label: "Гүйцэтгэж байна", variant: "default" as const, icon: Clock },
      COMPLETED: { label: "Дууссан", variant: "secondary" as const, icon: CheckCircle },
      CANCELLED: { label: "Цуцлагдсан", variant: "destructive" as const, icon: AlertCircle },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap];
    return (
      <Badge variant={statusInfo?.variant} className="flex items-center gap-1">
        {statusInfo?.icon && <statusInfo.icon className="w-3 h-3" />}
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

  const todayAssignments = assignments.filter(assignment => {
    const today = new Date();
    const assignmentDate = new Date(assignment.scheduledAt);
    return assignmentDate.toDateString() === today.toDateString();
  });

  const upcomingAssignments = assignments.filter(assignment => {
    const today = new Date();
    const assignmentDate = new Date(assignment.scheduledAt);
    return assignmentDate > today && assignment.status !== "COMPLETED" && assignment.status !== "CANCELLED";
  });

  const completedAssignments = assignments.filter(assignment => 
    assignment.status === "COMPLETED"
  );

  const stats = {
    totalAssignments: assignments.length,
    todayAssignments: todayAssignments.length,
    completedAssignments: completedAssignments.length,
    pendingAssignments: assignments.filter(a => a.status === "PENDING" || a.status === "CONFIRMED").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-primary" />
              <div>
                <span className="text-2xl font-bold">Cleaner Portal</span>
                <div className="text-sm text-muted-foreground">CleanPro</div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Button
                variant={activeTab === "assignments" ? "default" : "ghost"}
                onClick={() => setActiveTab("assignments")}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Даалгавар
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
                {user?.name || user?.email}
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
              variant={activeTab === "assignments" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("assignments")}
              className="flex-1"
            >
              Даалгавар
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

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Нийт даалгавар
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAssignments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Өнөөдрийн
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.todayAssignments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Дууссан
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedAssignments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Хүлээж буй
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingAssignments}</div>
            </CardContent>
          </Card>
        </div>

        {/* Assignments Tab */}
        {activeTab === "assignments" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Миний даалгавар</h1>
              <p className="text-xl text-muted-foreground">
                Танд хуваарилагдсан цэвэрлэгээний ажлууд
              </p>
            </div>

            {/* Today's Assignments */}
            {todayAssignments.length > 0 && (
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-700">
                    <Clock className="w-5 h-5 mr-2" />
                    Өнөөдрийн даалгавар ({todayAssignments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todayAssignments.map((assignment) => (
                      <Card key={assignment.id} className="hover-lift">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold">{assignment.service.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {assignment.customer?.fullName}
                              </p>
                            </div>
                            {getStatusBadge(assignment.status)}
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                                <span>{formatDate(assignment.scheduledAt)}</span>
                              </div>
                              <div className="flex items-start text-sm">
                                <MapPin className="w-4 h-4 mr-2 mt-1 text-muted-foreground flex-shrink-0" />
                                <span>{assignment.address}</span>
                              </div>
                              {assignment.customer?.phone && (
                                <div className="flex items-center text-sm">
                                  <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                                  <span>{assignment.customer.phone}</span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="text-xl font-bold text-primary">
                                {assignment.totalPrice.toLocaleString()}₮
                              </div>
                              <div className="flex gap-2">
                                {assignment.status === "CONFIRMED" && (
                                  <Button
                                    size="sm"
                                    onClick={() => updateBookingStatus(assignment.id, "IN_PROGRESS")}
                                    disabled={isLoading}
                                  >
                                    Эхлүүлэх
                                  </Button>
                                )}
                                {assignment.status === "IN_PROGRESS" && (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => updateBookingStatus(assignment.id, "COMPLETED")}
                                    disabled={isLoading}
                                  >
                                    Дуусгах
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>

                          {assignment.specialInstructions && (
                            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm">
                                <strong>Тэмдэглэл:</strong> {assignment.specialInstructions}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Upcoming Assignments */}
            {upcomingAssignments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Удахгүй болох даалгавар ({upcomingAssignments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAssignments.map((assignment) => (
                      <Card key={assignment.id} className="hover-lift border-l-4 border-l-yellow-400">
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold">{assignment.service.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {assignment.customer?.fullName}
                              </p>
                            </div>
                            {getStatusBadge(assignment.status)}
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center text-sm">
                              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                              <span>{formatDate(assignment.scheduledAt)}</span>
                            </div>
                            <div className="flex items-start text-sm">
                              <MapPin className="w-4 h-4 mr-2 mt-1 text-muted-foreground flex-shrink-0" />
                              <span>{assignment.address}</span>
                            </div>
                            <div className="text-lg font-semibold text-primary">
                              {assignment.totalPrice.toLocaleString()}₮
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* No Assignments */}
            {assignments.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Даалгавар байхгүй</h3>
                  <p className="text-muted-foreground">
                    Танд одоогоор хуваарилагдсан даалгавар байхгүй байна.
                  </p>
                </CardContent>
              </Card>
            )}
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
                      <label className="text-sm text-muted-foreground">Овог нэр</label>
                      <div className="text-lg font-medium">{user?.name || "Тодорхойгүй"}</div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Хэрэглэгчийн төрөл</label>
                      <div className="text-lg font-medium">Цэвэрлэгч</div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        Имэйл хаяг
                      </label>
                      <div className="text-lg font-medium">{user?.email}</div>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        Утасны дугаар
                      </label>
                      <div className="text-lg font-medium">{user.phone || "Тодорхойгүй"}</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-lg font-semibold mb-4">Статистик</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-4">
                          <div className="text-2xl font-bold text-primary">{stats.completedAssignments}</div>
                          <p className="text-sm text-muted-foreground">Дууссан ажил</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="text-2xl font-bold text-green-600">
                            {completedAssignments.reduce((sum, a) => sum + a.totalPrice, 0).toLocaleString()}₮
                          </div>
                          <p className="text-sm text-muted-foreground">Нийт орлого</p>
                        </CardContent>
                      </Card>
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
