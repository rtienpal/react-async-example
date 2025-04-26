import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RectangleHorizontal,
    Circle,
    Triangle,
    Minus,
    Loader2,
} from 'lucide-react';
//import { Button } from '@/components/ui/button'; // Remove the shadcn/ui import
import { Button } from 'react-bootstrap'; // Use React Bootstrap's Button
//import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS - REMOVE THIS LINE


interface Shape {
    id: string;
    element: React.ReactNode;
    label: string;
    duration: number;
}

const ConcurrentApp = () => {
    const [renderedShapes, setRenderedShapes] = useState<Shape[]>([]);
    const [queue, setQueue] = useState<Shape[]>([]);
    const timeoutRefs = useRef<{[key: string]: NodeJS.Timeout}>({});

    const shapes: Shape[] = [
        {
            id: 'rectangle',
            element: <RectangleHorizontal className="w-6 h-6" />,
            label: 'Rectangle',
            duration: 4,
        },
        {
            id: 'circle',
            element: <Circle className="w-6 h-6" />,
            label: 'Circle',
            duration: 1,
        },
        {
            id: 'triangle',
            element: <Triangle className="w-6 h-6" />,
            label: 'Triangle',
            duration: 3,
        },
        {
            id: 'line',
            element: <Minus className="w-6 h-6" />,
            label: 'Line',
            duration: 2,
        },
    ];

    const handleClick = (shape: Shape) => {
        const newShape = { ...shape, id: `${shape.id}-${Date.now()}` }; // Unique ID
        setQueue((prevQueue) => [...prevQueue, newShape]);

        const timer = setTimeout(() => {
            setRenderedShapes((prevShapes) => [...prevShapes, newShape]);
            setQueue((prevQueue) => prevQueue.filter((item) => item.id !== newShape.id));
            clearTimeout(timeoutRefs.current[newShape.id]);
        }, shape.duration * 1000);

        timeoutRefs.current[newShape.id] = timer;
    };

    useEffect(() => {
        return () => {
            // Clear all timeouts on unmount
            Object.values(timeoutRefs.current).forEach(clearTimeout);
            timeoutRefs.current = {};
        };
    }, []);

    const containerStyle = {  //added inline style
        backgroundColor: '#1f2937', // Tailwind gray-900
        backgroundImage: 'linear-gradient(to bottom, #1f2937, #374151)', // Tailwind gray-900 to gray-800
        minHeight: '100vh',
    };

    return (
        <div style={containerStyle}>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-white mb-6">
                    Concurrent App
                    </h1>
                </div>

                <div className="row justify-content-center gap-4">
                    {shapes.map((shape) => (
                        <Button
                            key={shape.id}
                            onClick={() => handleClick(shape)}
                            variant="outline-light" // Use Bootstrap button variant
                            className="col-6 col-sm-4 col-md-3 col-lg-2 d-flex flex-column align-items-center justify-content-center gap-2
                                       h-24 transition-transform duration-300
                                       hover:scale-105 active:scale-95"
                        >
                            {shape.element}
                            {shape.label}
                        </Button>
                    ))}
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-white">Rendered Shapes:</h2>
                    <div className="row gap-4">
                        <AnimatePresence>
                            {renderedShapes.map((shape) => (
                                <motion.div
                                    key={shape.id}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="col-6 col-sm-4 col-md-3 col-lg-2 d-flex align-items-center justify-content-center gap-2
                                               bg-white/5 text-white rounded-lg border border-white/5 shadow-md backdrop-blur-md"
                                >
                                    {shape.element}
                                    <span>{shape.label}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    {renderedShapes.length === 0 && (
                        <p className="text-gray-400">No shapes rendered yet.</p>
                    )}
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold text-white">Queue:</h2>
                    <div className="row gap-4">
                        <AnimatePresence>
                            {queue.map((shape) => (
                                <motion.div
                                    key={shape.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                    className="col-6 col-sm-4 col-md-3 col-lg-2 d-flex align-items-center justify-content-center gap-2
                                               bg-white/5 text-white animate-pulse rounded-lg border border-white/5 shadow-md backdrop-blur-md"
                                >
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>{shape.label}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    {queue.length === 0 && (
                        <p className="text-gray-400">No shapes in queue.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConcurrentApp;