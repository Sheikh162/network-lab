import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: <Zap size={24} className="text-primary" />,
    title: "Blazing Fast",
    description: "QEMU overlays allow nodes to be created and wiped instantly, getting you to work faster.",
  },
  {
    icon: <Shield size={24} className="text-primary" />,
    title: "Fully Isolated",
    description: "Each node is a separate VM, providing a safe and secure sandbox for all your testing needs.",
  },
  {
    icon: <Globe size={24} className="text-primary" />,
    title: "Browser-Based",
    description: "Access your virtual nodes from anywhere with an integrated Guacamole remote console.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="mx-auto w-full max-w-7xl py-12 md:py-16">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {features.map((feature) => (
          // Added transition and hover classes for the glow effect
          <Card 
            key={feature.title}
            className="transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/20"
          >
            <CardHeader className="items-center text-center">
              <div>{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}

// import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Zap, Shield, Globe } from "lucide-react";

// const features = [
//   {
//     icon: <Zap size={24} className="text-primary" />,
//     title: "Blazing Fast",
//     description: "QEMU overlays allow nodes to be created and wiped instantly, getting you to work faster.",
//   },
//   {
//     icon: <Shield size={24} className="text-primary" />,
//     title: "Fully Isolated",
//     description: "Each node is a separate VM, providing a safe and secure sandbox for all your testing needs.",
//   },
//   {
//     icon: <Globe size={24} className="text-primary" />,
//     title: "Browser-Based",
//     description: "Access your virtual nodes from anywhere with an integrated Guacamole remote console.",
//   },
// ];

// export default function FeaturesSection() {
//   return (
//     <section className="mx-auto w-full max-w-7xl py-12 md:py-16">
//       <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
//         {features.map((feature) => (
//           <Card key={feature.title}>
//             <CardHeader className="items-center text-center">
//               <div>{feature.icon}</div>
//               <CardTitle>{feature.title}</CardTitle>
//               <CardDescription>{feature.description}</CardDescription>
//             </CardHeader>
//           </Card>
//         ))}
//       </div>
//     </section>
//   );
// }