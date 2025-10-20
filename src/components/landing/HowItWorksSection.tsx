import Image from 'next/image';

const steps = [
  {
    step: "01",
    title: "Create a Node",
    description: "Click 'Add Node' to instantly generate a new, clean virtual machine environment using a lightweight QEMU overlay.",
    //imagePath: "/screenshots/sandbox-1.png",
    imagePath: "/screenshots/NodeLabs-1.png",

  },
  {
    step: "02",
    title: "Start and Connect",
    description: "Power on your node and access it directly in your browser through the integrated Guacamole console.",
    //imagePath: "/screenshots/sandbox-2.png",
    imagePath: "/screenshots/NodeLabs-2.png",
  },
  {
    step: "03",
    title: "VM in Action",
    description: "Your QEMU instance runs as a detached process on the server, efficiently managed by the backend application.",
    //imagePath: "/screenshots/sandbox-3.png",
    imagePath: "/screenshots/NodeLabs-3.png",
  },
  {
    step: "04", 
    title: "Wipe and Reset",
    description: "When you're finished, wipe the node to instantly reset it to its original state, ready for your next task.",
    //imagePath: "/screenshots/sandbox-4.png",
    imagePath: "/screenshots/NodeLabs-4.png",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="mx-auto w-full max-w-7xl py-12 md:py-16">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold tracking-tighter text-foreground">
          A Simple Workflow
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          From creation to console in under a minute.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-12">
        {steps.map((item, index) => (
          // The layout logic is now generalized to work for any number of steps
          <div key={item.step} className={`grid items-center gap-8 md:grid-cols-2 md:gap-12 ${index % 2 !== 0 ? 'md:grid-flow-row-dense' : ''}`}>
            {/* Image Display */}
            <div className={`
              flex items-center justify-center rounded-lg bg-muted/50 p-4 
              // This logic now correctly alternates the image position
              ${index % 2 !== 0 ? 'md:col-start-2' : ''}
              transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:ring-2 hover:ring-primary
            `}>
              <Image
                src={item.imagePath}
                alt={`${item.title} step screenshot`}
                width={1200}
                height={750}
                className="rounded-md border shadow-lg"
              />
            </div>

            {/* Text Content */}
            <div className="space-y-4">
              <span className="font-mono text-sm text-primary">{`// Step ${item.step}`}</span>
              <h3 className="text-3xl font-bold tracking-tighter">{item.title}</h3>
              <p className="text-lg text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


// import Image from 'next/image';

// const steps = [
//   {
//     step: "01",
//     title: "Create a Node",
//     description: "Click 'Add Node' to instantly generate a new, clean virtual machine environment using a lightweight QEMU overlay.",
//     imagePath: "/screenshots/sandbox-1.png", // Path to your image in the /public folder
//   },
//   {
//     step: "02",
//     title: "Start and Connect",
//     description: "Power on your node and access it directly in your browser through the integrated Guacamole console.",
//     imagePath: "/screenshots/sandbox-2.png", // Path to your image in the /public folder
//   },
//   {
//     step: "03",
//     title: "Wipe and Reset",
//     description: "When you're finished, wipe the node to instantly reset it to its original state, ready for your next task.",
//     imagePath: "/screenshots/sandbox-3.png", // Path to your image in the /public folder
//   },
// ];

// export default function HowItWorksSection() {
//   return (
//     <section className="mx-auto w-full max-w-7xl py-12 md:py-16">
//       <div className="mb-12 text-center">
//         <h2 className="text-4xl font-bold tracking-tighter text-foreground">
//           A Simple Workflow
//         </h2>
//         <p className="mt-2 text-lg text-muted-foreground">
//           From creation to console in under a minute.
//         </p>
//       </div>
//       <div className="grid grid-cols-1 gap-12">
//         {steps.map((item, index) => (
//           <div key={item.step} className={`grid items-center gap-8 md:grid-cols-2 md:gap-12 ${index === 1 ? 'md:grid-flow-row-dense' : ''}`}>
//             {/* Image Display */}
//             <div className={`flex items-center justify-center rounded-lg bg-muted/50 p-4 ${index === 1 ? 'md:col-start-2' : ''}`}>
//               <Image
//                 src={item.imagePath}
//                 alt={`${item.title} step screenshot`}
//                 width={1200}
//                 height={750}
//                 className="rounded-md border shadow-lg"
//               />
//             </div>

//             {/* Text Content */}
//             <div className="space-y-4">
//               <span className="font-mono text-sm text-primary">{`// Step ${item.step}`}</span>
//               <h3 className="text-3xl font-bold tracking-tighter">{item.title}</h3>
//               <p className="text-lg text-muted-foreground">
//                 {item.description}
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }