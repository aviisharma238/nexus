"use client";
import React from "react";
import { motion } from "framer-motion";

interface Event {
  title: string;
  description: string;
  color: string;
  video: string;
}

const events: Event[] = [
  {
    title: "Collaboration",
    description: "Empowering Collaboration for Stronger Communities.",
    color: "from-blue-700 to-blue-600",
    video: "/video/hybrid-event.mov",
  },
  {
    title: "Community Engagement",
    description: "Where Community Spirit Comes Alive.",
    color: "from-orange-500 to-orange-400",
    video: "/video/inperson-event.mov",
  },
  {
    title: "Volunteer Coordination",
    description: "Together We Volunteer, Together We Thrive.",
    color: "from-purple-500 to-purple-400",
    video: "/video/virtual-event.mov",
  },
  {
    title: "Resource Booking",
    description: "Book Smarter. Plan Better. Together.",
    color: "from-purple-500 to-purple-400",
    video: "/video/virtual-event.mov",
  },
  {
    title: "Promotion",
    description: "Spreading the Word, Strengthening Connections.",
    color: "from-orange-500 to-orange-400",
    video: "/video/inperson-event.mov",
  },
  {
    title: "Real-Time Communication",
    description: "Stay Connected. Communicate in Real Time.",
    color: "from-blue-700 to-blue-600",
    video: "/video/inperson-event.mov",
  },
];

const EventTypes: React.FC = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_#c7d2fe_0%,_transparent_70%)]"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          All the flexibility your events need
        </h2>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Plan. Connect. Celebrate. Make Your Community Stronger.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-6 max-w-7xl mx-auto">
        {events.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04 }}
            transition={{
              duration: 0.7,
              delay: index * 0.15,
              type: "spring",
              stiffness: 120,
            }}
            viewport={{ once: true }}
            className={`group rounded-3xl bg-gradient-to-br ${event.color} p-[2px] shadow-xl hover:shadow-2xl transition-all`}
          >
            <div className="bg-white rounded-3xl h-full p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                <div className="flex items-center gap-2 text-blue-600 font-medium cursor-pointer hover:gap-3 transition-all">
                  <span>Explore more</span>
                  <span>→</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl overflow-hidden relative">
                <motion.video
                  src={event.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent rounded-xl"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default EventTypes;
