
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Shield, Clock, Star, Users, CheckCircle, MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

const services = [
  {
    title: "Гэрийн цэвэрлэгээ",
    titleEn: "Home Cleaning",
    description: "Таны гэрийг гялалзуулж, эрүүл ахуйн стандартыг дээшлүүлье",
    price: "25,000₮",
    duration: "2-3 цаг",
    features: ["Ерөнхий цэвэрлэгээ", "Ариутгал", "Шал угаалга", "Тоос арилгах"],
    icon: Sparkles,
    color: "bg-blue-500",
  },
  {
    title: "Оффисын цэвэрлэгээ",
    titleEn: "Office Cleaning",
    description: "Таны ажлын орчинд мэргэжлийн цэвэрлэгээний үйлчилгээ",
    price: "45,000₮",
    duration: "3-4 цаг",
    features: ["Ширээ, сандал", "Электроник төхөөрөмж", "Шал угаалга", "Хогийн сав"],
    icon: Shield,
    color: "bg-purple-500",
  },
];

const stats = [
  { label: "Гүйцэтгэсэн үйлчилгээ", value: 2500, suffix: "+" },
  { label: "Сэтгэл хангалуун үйлчлүүлэгч", value: 98, suffix: "%" },
  { label: "Мэргэжлийн цэвэрлэгч", value: 50, suffix: "+" },
  { label: "Жилийн туршлага", value: 5, suffix: "+" },
];

const CountUpNumber = ({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [inView, end, duration]);

  return (
    <span ref={ref} className="text-4xl font-bold text-white">
      {count}{suffix}
    </span>
  );
};

export default function HomePage() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true });
  const [servicesRef, servicesInView] = useInView({ triggerOnce: true });
  const [statsRef, statsInView] = useInView({ triggerOnce: true });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">CleanPro</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#services" className="text-foreground/80 hover:text-primary transition-colors">
                Үйлчилгээ
              </Link>
              <Link href="#about" className="text-foreground/80 hover:text-primary transition-colors">
                Танилцуулга
              </Link>
              <Link href="#contact" className="text-foreground/80 hover:text-primary transition-colors">
                Холбоо барих
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">Нэвтрэх</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Бүртгүүлэх</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Мэргэжлийн
              <br />
              Цэвэрлэгээний Үйлчилгээ
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Таны орон сууц болон оффисын цэвэрлэгээг хамгийн дээд чанарын стандартаар гүйцэтгэе
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-6 text-lg" asChild>
                <Link href="/auth/signup">Захиалах</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-6 text-lg" asChild>
                <Link href="#services">
                  <Clock className="w-5 h-5 mr-2" />
                  Үйлчилгээ харах
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-bounce">
          <div className="w-4 h-4 bg-blue-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-40 right-16 animate-bounce animation-delay-1000">
          <div className="w-6 h-6 bg-purple-400 rounded-full opacity-40"></div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-bounce animation-delay-2000">
          <div className="w-3 h-3 bg-pink-400 rounded-full opacity-50"></div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            ref={servicesRef}
            initial={{ opacity: 0, y: 30 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Манай үйлчилгээ
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Та өөрийн хэрэгцээнд тохирсон цэвэрлэгээний үйлчилгээг сонгоно уу
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={servicesInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <Card className="h-full hover-lift group cursor-pointer border-2 hover:border-primary/20">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4 mb-3">
                        <div className={`p-3 rounded-lg ${service.color} text-white`}>
                          <service.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                            {service.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">{service.titleEn}</p>
                        </div>
                      </div>
                      <CardDescription className="text-base">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-3xl font-bold text-primary">{service.price}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {service.duration}
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full mt-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                        <Link href="/auth/signup">
                          Захиалах
                          <Sparkles className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Манай амжилт
              </h2>
              <p className="text-xl opacity-90">
                Үйлчлүүлэгчидийн итгэлийг олж авсан үр дүн
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="mb-2">
                    <CountUpNumber end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm opacity-90">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Бидний тухай
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                CleanPro нь 2019 оноос хойш Монгол Улсад үйл ажиллаж буй цэвэрлэгээний тэргүүлэгч компани юм
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Манай эрхэм зорилго</h3>
                    <p className="text-muted-foreground">
                      Бид таны амьдралыг хялбарчлах, цэвэрхэн эрүүл орчинд амьдрах боломжийг 
                      олгоход зорилж байна. Манай мэргэжлийн баг таны гэр, оффисыг хамгийн 
                      дээд чанарын стандартаар цэвэрлэж өгөх болно.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Яагаад биднийг сонгох ёстой вэ?</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span>5 жилийн туршлагатай мэргэжлийн баг</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span>Экологийн найрсаг цэвэрлэгээний бодис</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span>24/7 харилцагчийн үйлчилгээ</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span>100% сэтгэл ханамжийн баталгаа</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 bg-white/80 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Манай алсын хараа</h3>
                    <p className="text-muted-foreground mb-6">
                      Монгол Улсын хамгийн найдвартай, технологийн шинэ шийдлээр 
                      тоноглогдсон цэвэрлэгээний үйлчилгээний компани болох.
                    </p>
                    <div className="flex justify-around text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">2500+</div>
                        <div className="text-sm text-muted-foreground">Сэтгэл хангалуун үйлчлүүлэгч</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">50+</div>
                        <div className="text-sm text-muted-foreground">Мэргэжлийн ажилтан</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">5+</div>
                        <div className="text-sm text-muted-foreground">Жилийн туршлага</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Холбоо барих
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Бидэнтэй холбогдож, танд тохирсон үйлчилгээг захиалаарай
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Холбоо барих мэдээлэл</h3>
                    <div className="space-y-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Хаяг</h4>
                          <p className="text-muted-foreground">
                            Улаанбаатар хот, Сүхбаатар дүүрэг,<br />
                            1-р хороо, Энхтайван өргөн чөлөө 54
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Phone className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Утас</h4>
                          <p className="text-muted-foreground">+976 7000-1234</p>
                          <p className="text-muted-foreground">+976 9900-5678</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Имэйл</h4>
                          <p className="text-muted-foreground">info@cleanpro.mn</p>
                          <p className="text-muted-foreground">support@cleanpro.mn</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Ажлын цаг</h4>
                          <p className="text-muted-foreground">Даваа - Баасан: 08:00 - 18:00</p>
                          <p className="text-muted-foreground">Бямба - Ням: 09:00 - 17:00</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Contact */}
                  <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <h4 className="text-xl font-bold mb-4">Шуурхай холбогдох</h4>
                    <p className="mb-4 opacity-90">
                      Та бидэнтэй утсаар шууд холбогдож, үйлчилгээг захиалах боломжтой
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        variant="secondary" 
                        size="lg" 
                        className="flex-1"
                        onClick={() => window.location.href = 'tel:+97670001234'}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        7000-1234
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="lg" 
                        className="flex-1"
                        onClick={() => window.location.href = 'mailto:info@cleanpro.mn'}
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Имэйл илгээх
                      </Button>
                    </div>
                  </Card>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Мессеж илгээх</h3>
                  <form className="space-y-6" onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const name = formData.get('name');
                    const phone = formData.get('phone');
                    const email = formData.get('email');
                    const service = formData.get('service');
                    const message = formData.get('message');
                    
                    const mailtoLink = `mailto:info@cleanpro.mn?subject=Үйлчилгээний захиалга - ${service || 'Ерөнхий'}&body=Нэр: ${name}%0АУтас: ${phone}%0АИмэйл: ${email}%0АҮйлчилгээ: ${service}%0А%0АМессеж:%0А${message}`;
                    window.location.href = mailtoLink;
                  }}>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Овог нэр *</label>
                        <input 
                          type="text"
                          name="name"
                          required
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
                          placeholder="Таны овог нэр"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Утас *</label>
                        <input 
                          type="tel"
                          name="phone"
                          required
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
                          placeholder="+976 9900-0000"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Имэйл *</label>
                      <input 
                        type="email"
                        name="email"
                        required
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Үйлчилгээ</label>
                      <select name="service" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                        <option value="">Үйлчилгээ сонгох</option>
                        <option value="Гэрийн цэвэрлэгээ">Гэрийн цэвэрлэгээ</option>
                        <option value="Оффисын цэвэрлэгээ">Оффисын цэвэрлэгээ</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Мессеж *</label>
                      <textarea 
                        name="message"
                        required
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent min-h-32"
                        placeholder="Танд хэрэгтэй үйлчилгээний талаар дэлгэрэнгүй бичнэ үү..."
                      ></textarea>
                    </div>

                    <Button size="lg" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Мессеж илгээх
                    </Button>
                  </form>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Star className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Өнөөдөр л эхлээрэй!
              </h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Мэргэжлийн цэвэрлэгээний үйлчилгээгээр таны амьдралыг хялбарчилъя
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="px-8 py-6 text-lg text-primary" asChild>
                  <Link href="/auth/signup">
                    <Users className="w-5 h-5 mr-2" />
                    Бүртгүүлэх
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-white text-white hover:bg-white hover:text-primary" asChild>
                  <Link href="/auth/signin">Нэвтрэх</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/50 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">CleanPro</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Мэргэжлийн цэвэрлэгээний үйлчилгээгээр таны амьдралыг өөрчилье
            </p>
            <p className="text-sm text-muted-foreground">
              © 2024 CleanPro. Бүх эрх хуулиар хамгаалагдсан.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
