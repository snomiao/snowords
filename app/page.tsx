"use client";
import { useState } from "react";
// import Image from "next/image";
// import styles from "./page.module.css";
import "./globals.css";

export default function Home() {
  const [value, valueSet] = useState(`bpm 120
key C major
sequence C3 D3 E3 F3 G3 A3 B3 C4`);
  const onSing = () => {
    const audioContext = new AudioContext();

    const parseMusic = (input) => {
      const lines = input.split("\n");
      const music = {
        bpm: 120,
        key: "C major",
        sequence: [],
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith("bpm")) {
          music.bpm = parseInt(line.slice(4));
        } else if (line.startsWith("key")) {
          music.key = line.slice(4);
        } else if (line.startsWith("sequence")) {
          const notes = line.slice(9).split(" ");
          music.sequence = notes;
        }
      }

      return music;
    };

    const playMusic = (music) => {
      const durations = [];
      console.log(music);
      const sequence = music.sequence.map((note) => {
        const noteName = note.slice(0, note.length - 1);
        const octave = parseInt(note.slice(note.length - 1));
        const frequency = noteFrequencies[noteName] * Math.pow(2, octave - 4);
        console.error(frequency, noteName, octave);
        const duration = (60 / music.bpm) * 4;
        durations.push(duration);
        return new OscillatorNode(audioContext, { type: "sine", frequency });
      });

      let startTime = audioContext.currentTime;
      sequence.forEach((oscillator, i) => {
        const duration = durations[i];
        oscillator.connect(audioContext.destination);
        oscillator.start(startTime + i * duration);
        oscillator.stop(startTime + (i + 1) * duration);
      });
    };

    const noteFrequencies = {
      C: 16.35,
      "C#": 17.32,
      D: 18.35,
      "D#": 19.45,
      E: 20.6,
      F: 21.83,
      "F#": 23.12,
      G: 24.5,
      "G#": 25.96,
      A: 27.5,
      "A#": 29.14,
      B: 30.87,
      C2: 32.7,
      "C#2": 34.65,
      D2: 36.71,
      "D#2": 38.89,
      E2: 41.2,
      F2: 43.65,
      "F#2": 46.25,
      G2: 49.0,
      "G#2": 51.91,
      A2: 55.0,
      "A#2": 58.27,
      B2: 61.74,
      C3: 65.41,
      "C#3": 69.3,
      D3: 73.42,
      "D#3": 77.78,
      E3: 82.41,
      F3: 87.31,
      "F#3": 92.5,
      G3: 98.0,
      "G#3": 103.83,
      A3: 110.0,
      "A#3": 116.54,
      B3: 123.47,
      C4: 130.81,
      "C#4": 138.59,
      D4: 146.83,
      "D#4": 155.56,
      E4: 164.81,
      F4: 174.61,
      "F#4": 185.0,
      G4: 196.0,
      "G#4": 207.65,
      A4: 220.0,
      "A#4": 233.08,
      B4: 246.94,
      C5: 261.63,
      "C#5": 277.18,
      D5: 293.66,
      "D#5": 311.13,
      E5: 329.63,
      F5: 349.23,
      "F#5": 369.99,
      G5: 392.0,
      "G#5": 415.3,
      A5: 440.0,
      "A#5": 466.16,
      B5: 493.88,
      C6: 523.25,
      "C#6": 554.37,
      D6: 587.33,
      "D#6": 622.25,
      E6: 659.25,
      F6: 698.46,
      "F#6": 739.99,
      G6: 783.99,
      "G#6": 830.61,
      A6: 880.0,
      "A#6": 932.33,
      B6: 987.77,
    };

    const music = parseMusic(value);
    playMusic(music);
  };

  const onHear = () => {
    const constraints = { audio: true };
    let recordedChunks = [];

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            recordedChunks.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const recordedBlob = new Blob(recordedChunks, { type: "audio/wav" });

          const audioContext = new AudioContext();
          const fileReader = new FileReader();

          fileReader.onload = () => {
            const arrayBuffer = fileReader.result as ArrayBuffer;
            audioContext.decodeAudioData(arrayBuffer, (buffer) => {
              const source = audioContext.createBufferSource();
              source.buffer = buffer;

              // Modify the audio using Web Audio API
              const gainNode = audioContext.createGain();
              gainNode.gain.value = 0.5;
              const convNode = audioContext.createConvolver();
              
              source.connect(gainNode);
              gainNode.connect(convNode);
              convNode.connect(audioContext.destination);

              // Play back the modified audio
              source.start(0);
            });
          };

          fileReader.readAsArrayBuffer(recordedBlob);
          recordedChunks = [];
        };

        // Record for 5 seconds
        setTimeout(() => {
          mediaRecorder.stop();
        }, 5000);

        mediaRecorder.start();
      })
      .catch(console.error);
  };
  return (
    <div className="row h-[100vh] items-center">
      <main className="col m-auto gap-8">
        <div>
          <h1 className="flex text-lg">
            <span className="text-2xl">Welcome</span>
            <sup>to</sup>
            <a className="text-9xl font-bold" href="https://voice.snomiao.com">
              snovoice
            </a>
          </h1>
        </div>
        <div className="hihi gap-4 w-full">
          <div className="soso gap-4">
            <button className="btn btn-primary" onClick={onHear}>
              Hear
            </button>
            <button className="btn btn-primary" onClick={onSing}>
              Sing
            </button>
          </div>
          <textarea
            className="min-h-[50vh] min-w-[50vw] shadow-md p-1"
            value={value}
            onChange={(e) => valueSet(e.currentTarget.value)}
          />
        </div>
      </main>
    </div>
  );
}
