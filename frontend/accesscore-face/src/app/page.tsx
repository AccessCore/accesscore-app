"use client";

import { actions } from "@/redux/auth/auth-slice";
import { AppDispatch, useAppSelector } from "@/redux/store";
import { api } from "@/utils/api";
import * as faceapi from 'face-api.js';
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const authData = useAppSelector((state) => state.auth);

  const router = useRouter();

  if (!authData.isLoggedIn) {
    redirect('/login');
  }

  useEffect(() => {
    if (authData.token !== "" && authData.username == "Unknown") {
      api.get("/users/bytoken", {
        headers: {
          Authorization: authData.token
        }
      }).then((response) => {
        dispatch(actions.LogIn({
          email: response.data.email,
          isLoggedIn: true,
          token: authData.token,
          id: response.data.id,
          username: response.data.name
        }));
      })
    }

    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      const videoEl = videoRef.current;
      if (videoEl) {
        videoEl.srcObject = stream;
      }
    })
  }, [])

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


  async function handleSaveFace() {
    const videoEl = videoRef.current as HTMLVideoElement;
    const canvasEl = canvasRef.current as HTMLCanvasElement;

    if (!videoEl || !canvasEl) return;

    const detection = await faceapi.detectSingleFace(
      videoEl as HTMLVideoElement, new faceapi.TinyFaceDetectorOptions()
    ).withFaceLandmarks().withFaceDescriptor();

    if (detection) {

      const descriptor = Array.from(detection.descriptor);
      const detectionsJson = JSON.stringify(descriptor);

      await api.post(`/faces`, {
        face: detectionsJson
      }, {
        headers: {
          Authorization: authData.token
        }
      }).then((response) => {
        alert('Face gravada');
      })

      console.log('Face detectada: ', detectionsJson);
    }
  }

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
    }

    setTimeout(handleLoadMetadata, 100);
  }

  async function handleExit() {
    dispatch(actions.LogOut());
    router.push('/login');
  }

  return (
    <main className="grid grid-cols-3 h-screen">

      <div className="col-span-2 bg-slate-100">
        <div className="fixed flex flex-col p-4">
          <button onClick={handleSaveFace} className="bg-[#4f46e5] px-3 py-2 rounded text-slate-50 text-sm hover:bg-[#4f46e5]/50">Cadastrar Facial</button>
        </div>
        <div className="flex h-full justify-end items-center">
          <div className="flex rounded-lg -mr-[100px]">
            <div className="relative bg-white rounded-xl flex items-center justify-center w-full h-full p-2">
              <video onLoadedMetadata={handleLoadMetadata} autoPlay ref={videoRef} >
              </video>
              <canvas ref={canvasRef} className='absolute inset-0 w-full h-full'></canvas>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-1 bg-[#4f46e5]">
        <div className="flex flex-col text-white items-end p-4">
          <span>{authData.email}</span>
          <span>{authData.username}</span>
          <button onClick={handleExit} className="mt-4">Sair</button>
        </div>
      </div>

    </main>
  );
}
