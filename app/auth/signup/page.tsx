
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    role: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { email, password, confirmPassword, fullName, phone, role, address } = formData;
    
    if (!email || !password || !fullName || !phone || !role) {
      toast.error("Заавал бөглөх талбаруудыг бөглөнө үү");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Нууц үг таарахгүй байна");
      return;
    }

    if (password.length < 6) {
      toast.error("Нууц үг дор хаяж 6 тэмдэгт байх ёстой");
      return;
    }

    // Phone number validation
    const phoneRegex = /^[0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Утасны дугаар 8 оронтой тоо байх ёстой");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
          phone,
          role,
          address: address || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Алдаа гарлаа");
        return;
      }

      toast.success("Амжилттай бүртгэгдлээ!");
      
      // Auto sign in after successful signup
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        // Redirect to home and let middleware handle role-based redirect
        router.push("/");
      } else {
        router.replace("/auth/signin");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold">
            <Sparkles className="h-8 w-8 text-primary" />
            <span>CleanPro</span>
          </Link>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold">Бүртгүүлэх</CardTitle>
            <CardDescription>
              Шинэ бүртгэл үүсгэж эхлээрэй
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Хэрэглэгчийн төрөл *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Төрөлөө сонгоно уу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CUSTOMER">Үйлчлүүлэгч</SelectItem>
                    <SelectItem value="CLEANER">Цэвэрлэгч</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Овог нэр *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Жишээ: Болдбаатарын Батбаяр"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Имэйл хаяг *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Утасны дугаар *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="99998888 (8 орон)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Нууц үг *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Нууц үг баталгаажуулах *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Хаяг</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Хаягаа оруулна уу"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="min-h-20"
                />
              </div>

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Бүртгэж байна...
                  </>
                ) : (
                  "Бүртгүүлэх"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Аль хэдийн бүртгэлтэй юу?{" "}
                <Link href="/auth/signin" className="text-primary hover:underline font-medium">
                  Нэвтрэх
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
