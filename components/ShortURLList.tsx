"use client"

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { TOKEN_COOKIE_NAME } from "../config/auth";
import { ShortURl } from "../models/shortUrl.model"
import ShortURLDetail from "./ShortURLDetail";

export default function ShortURlList() {
    const [shortURLs, setShortURLs] = useState<ShortURl[]>([]);
    const searchParams = useSearchParams()
    const [cookie, setCookie] = useCookies();

    const getShortUrls = async (page: number | string, limit: number | string) => {
        return fetch(`${process.env.HOST}/${process.env.API_V}/short-urls?page${page}&?limit=${limit}`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookie[TOKEN_COOKIE_NAME]}`
            }
        })
        .then(res => res.json())
    }

    useEffect(() => {
        const page = searchParams.get('page'), limit = searchParams.get('limit');

        if (typeof page !== "string" || typeof limit !== "string") return;

        getShortUrls(page, limit)
            .then(setShortURLs)
            .catch(console.log)
    }, [])
    
    return (
        <section className="flex flex-col space-y-3">
            {
                shortURLs.map(s => (
                    <ShortURLDetail shortURL={s} />
                ))
            }
        </section>
    )
}