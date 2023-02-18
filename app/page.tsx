"use client";
import { useState } from "react";
import "./globals.css";

export default function Home() {
  const words = [{ dt: "asdf", dd: "zxcv" }];

  return (
    <div className="row h-[100vh] items-center">
      <main className="col m-auto gap-8">
        <div>
          <h1 className="flex text-lg">
            <span className="text-2xl">Welcome</span>
            <sup>to</sup>
            <a
              className="text-9xl font-bold"
              href="https://snowords.vercel.com"
            >
              snowords
            </a>
          </h1>
        </div>
        <div className="hihi gap-4 w-full ">
          {words.map(({ dt, dd }) => (
            <dl
              tabIndex={0}
              className="card dropdown hover:dropdown-open dropdown-right"
            >
              <dt>{dt}</dt>
              <dd className="dropdown-content">{dd}</dd>
            </dl>
          ))}
        </div>
      </main>
    </div>
  );
}
