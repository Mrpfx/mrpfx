'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DynamicVideo } from '@/lib/types';
import { getYoutubeSettings } from '@/app/actions/youtube-settings';
import { Loader2, Youtube } from 'lucide-react';

const FALLBACK_VIDEOS: DynamicVideo[] = [
    {
        id: "8hrXc3vvUYk",
        title: "Mr P Fx Official Trading Strategy",
        thumbnail: "https://img.youtube.com/vi/8hrXc3vvUYk/hqdefault.jpg"
    },
    {
        id: "Tl0Xv26Xn5g",
        title: "Live Trading Session with Mr P",
        thumbnail: "https://img.youtube.com/vi/Tl0Xv26Xn5g/hqdefault.jpg"
    },
    {
        id: "RTSjkojGsqc",
        title: "Forex Market Analysis & Tips",
        thumbnail: "https://img.youtube.com/vi/RTSjkojGsqc/hqdefault.jpg"
    }
];

export default function TradingStrategy() {
    const [videos, setVideos] = useState<DynamicVideo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideosFromYouTube = async () => {
            const settings = await getYoutubeSettings();
            const apiKey = settings.apiKey || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
            const channelId = settings.channelId || process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || "UC1m-GvV3P83C66m105c_n6g";

            if (!apiKey) {
                console.warn("YouTube API Key missing, using fallback videos.");
                setVideos(settings.defaultVideos || FALLBACK_VIDEOS);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=3&type=video`
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("YouTube API Error:", errorData);
                    throw new Error("YouTube API request failed");
                }

                const data = await response.json();
                const fetchedVideos: DynamicVideo[] = data.items.map((item: any) => ({
                    id: item.id.videoId,
                    title: item.snippet.title,
                    thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url
                }));

                setVideos(fetchedVideos.length > 0 ? fetchedVideos : (settings.defaultVideos || FALLBACK_VIDEOS));
            } catch (error) {
                console.error("Failed to fetch YouTube videos:", error);
                setVideos(settings.defaultVideos || FALLBACK_VIDEOS);
            } finally {
                setLoading(false);
            }
        };

        fetchVideosFromYouTube();
    }, []);

    return (
        <section className="bg-white py-16 lg:py-24">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full mb-4 uppercase tracking-widest border border-red-100">
                        <Youtube className="w-4 h-4" />
                        Live Feed
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4">Trading Strategy</h2>
                    <p className="text-slate-600 text-lg leading-relaxed">
                        Explore our <span className="text-red-600 font-black">YouTube Channel</span>. Get yourself equipped for the world of Trading.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="aspect-video bg-gray-50 rounded-2xl animate-pulse flex items-center justify-center border border-gray-100">
                                <Loader2 className="w-8 h-8 text-gray-200 animate-spin" />
                            </div>
                        ))
                    ) : videos.map((video, index) => (
                        <Link
                            href={`https://www.youtube.com/watch?v=${video.id}`}
                            key={index}
                            target="_blank"
                            className="group relative aspect-video bg-slate-900 rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 block border border-slate-200/10"
                        >
                            <Image
                                src={video.thumbnail}
                                alt={video.title}
                                fill
                                className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                unoptimized
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target.src.includes('hqdefault.jpg')) {
                                        target.src = target.src.replace('hqdefault.jpg', 'mqdefault.jpg');
                                    }
                                }}
                            />

                            {/* Duration Badge / Date */}
                            <div className="absolute top-3 right-3 bg-red-600 text-white text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-wider shadow-lg transform group-hover:translate-x-1 transition-transform">
                                {index === 0 ? 'Latest' : 'New'}
                            </div>

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all duration-300">
                                <div className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center pl-1 shadow-2xl transform group-hover:scale-125 transition-all duration-500 ring-4 ring-white/20 group-hover:ring-white/40">
                                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent"></div>
                                </div>
                            </div>

                            {/* Title Overlay Gradient */}
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>
                            <div className="absolute bottom-5 left-5 right-14 z-10">
                                <p className="text-white font-black text-base line-clamp-2 drop-shadow-2xl leading-tight group-hover:text-red-400 transition-colors" dangerouslySetInnerHTML={{ __html: video.title }} />
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="https://www.youtube.com/@MrPFx"
                        target="_blank"
                        className="inline-flex items-center gap-3 px-12 py-4 bg-[#FF0033] text-white font-black rounded-xl hover:bg-black transition-all duration-300 uppercase tracking-[0.1em] shadow-xl hover:shadow-2xl transform hover:-translate-y-1 relative group overflow-hidden"
                    >
                        <span className="relative z-10">Subscribe to Channel</span>
                        <Youtube className="w-5 h-5 relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
