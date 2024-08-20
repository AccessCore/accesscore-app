"use client";

import webcam from "@/assets/webcam.png";
import baner from "@/assets/baner.jpg";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import * as faceapi from 'face-api.js';
import { api } from "@/utils/api";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { actions } from "@/redux/auth/auth-slice";
import { useRouter } from "next/navigation";

export default function Face() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    Promise.all([
      faceapi.loadTinyFaceDetectorModel('/models'),
      faceapi.loadFaceLandmarkModel('/models'),
      faceapi.loadFaceExpressionModel('/models'),
      faceapi.loadFaceRecognitionModel('/models')
    ]).then(() => {
      console.log('Models loaded')
    })
  }, [])

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      const videoEl = videoRef.current;
      if (videoEl) {
        videoEl.srcObject = stream;
      }
    })
  }, [])

  async function handleLoadMetadata() {
    const videoEl = videoRef.current as HTMLVideoElement;
    const canvasEl = canvasRef.current as HTMLCanvasElement;

    if (!videoEl || !canvasEl) return;

    const detection = await faceapi.detectSingleFace(
      videoEl as HTMLVideoElement, new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks().withFaceExpressions().withFaceDescriptor();

    if (detection) {
      const dimensions = {
        width: videoEl?.offsetWidth,
        height: videoEl?.offsetHeight
      }

      faceapi.matchDimensions(canvasEl, dimensions);
      const resizedResults = faceapi.resizeResults(detection, dimensions);
      faceapi.draw.drawDetections(canvasEl, resizedResults);

      const descriptor = Array.from(detection.descriptor);
      const detectionsJson = JSON.stringify(descriptor);

      console.log('Face:', JSON.stringify(detectionsJson));

      try {
        const payload = await api.post("/auth/face", {
          face: detectionsJson
        })

        if (payload.status === 201) {
          dispatch(actions.LogIn({
            email: payload.data.user.email,
            isLoggedIn: true,
            token: payload.data.accessToken,
            id: payload.data.user.id,
            username: payload.data.user.name
          }));

          router.push("/");
        }
      } catch (error) {
        console.log('Error:', error);
      }
    }

    setTimeout(handleLoadMetadata, 100);
  }

  return (
    <main className="grid grid-cols-3 h-screen overflow-hidden">

      <div className="col-span-2 bg-slate-100 flex flex-col items-center justify-center">

        <div className="flex gap-2">
          <Image src={webcam} className="title w-[32px] opacity-0" alt="Webcam" />
          <h1 className='title opacity-0 text-2xl font-semibold text-slate-600'>Bem vindo ao AccessCore</h1>
        </div>
        <span className='title opacity-0 text-sm text-center text-slate-400'>Faça login para continuar</span>
        <div className="flex h-full justify-end items-center">
          <div className="flex rounded-lg -mr-[100px]">
            <div className="relative bg-white rounded-xl flex items-center justify-center w-full h-full p-2">
              <video onLoadedMetadata={handleLoadMetadata} autoPlay ref={videoRef} >
              </video>
              <canvas ref={canvasRef} className='absolute inset-0 w-full h-full'></canvas>
            </div>
          </div>
        </div>
        <Link
          href="/login"
          className="text-sm px-3 py-2 mt-4 rounded-lg text-center 
                      bg-[#4f46e5] font-medium text-white 
                      hover:bg-[#4f46e5]/50 focus:bg-[#4f46e5]/50">
          Voltar
        </Link>

      </div>
      <div className="relative col-span-1 bg-[#4f46e5] flex flex-col items-center justify-center">
        <Image priority={true} quality={100} className="baner opacity-0 -ml-[200px] w-96 object-cover rounded-3xl" src={baner} alt="Web cam" />
      </div>
    </main >
  )
}