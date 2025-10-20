'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    // The section is now cleaner, with no background or mask styles.
    // It just handles padding and content alignment.
    <section className="w-full py-24 md:py-32 lg:py-40">
      <motion.div
        className="container mx-auto text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Instant, Disposable Network Labs
        </h1>
        <h2 className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mt-4">
          Create, Manage, Access VMs Instantly. In Your Browser.
        </h2>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/lab" passHref>
            <Button size="lg">
              Launch Lab
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

// import Link from 'next/link';
// import { Button } from '@/components/ui/button';

// export default function HeroSection() {
//   return (
//     <section className="mx-auto flex max-w-5xl flex-col items-center justify-center py-24 text-center md:py-32">
//       <div className="space-y-6">
//         <h1 className="text-5xl font-bold tracking-tighter text-foreground sm:text-6xl md:text-7xl">
//           Instant, Disposable Network Labs
//         </h1>
//         <h2 className="text-xl text-muted-foreground md:text-2xl">
//           Powered by QEMU Overlays. In Your Browser.
//         </h2>
//         <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground mx-auto">
//           Spin up, configure, and destroy lightweight virtual nodes in seconds. The perfect sandbox for network testing, security research, and rapid development.
//         </p>
//         <Button asChild size="lg">
//           <Link href="/lab">Launch Lab</Link>
//         </Button>
//       </div>
//     </section>
//   );
// }