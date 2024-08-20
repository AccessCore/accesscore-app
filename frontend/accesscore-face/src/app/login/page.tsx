"use client";

import Link from "next/link";
import webcam from "@/assets/webcam.png";
import baner from "@/assets/baner.jpg";
import Image from "next/image";
import { useLayoutEffect } from "react";
import gsap from "gsap";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/input";
import { api } from "@/utils/api";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { actions } from "@/redux/auth/auth-slice";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email("Digite um email válido").min(1, "O email"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  useLayoutEffect(() => {
    gsap.fromTo(".baner", {
      opacity: 0,
      x: 160,
    }, {
      opacity: 1,
      x: 0,
    })

    gsap.fromTo(".title", {
      opacity: 0,
      y: 160,
    }, {
      opacity: 1,
      y: 0,
    })

  }, [])

  async function handleRegisterAuth(data: FormData) {

    try {
      const payload = await api.post("/auth", {
        email: data.email,
        password: data.password
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
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        // Erro vindo da resposta da API
        if (error.response) {
          alert(error.response.data.message);
          console.error("Erro da API", error.response.data);
          console.error("Erro da API Status", error.response.status);
          // Aqui você pode mostrar uma mensagem de erro específica ao usuário
        } else if (error.request) {
          console.error("Sem resposta da API", error.request);
          // Aqui você pode informar o usuário que a API não respondeu
        } else {
          console.error("Erro na configuração da solicitação", error.message);
          // Aqui você pode informar o usuário sobre um erro na configuração da solicitação
        }
      } else {
        // Outro tipo de erro
        console.error("Erro desconhecido", error);
      }
    }
  }

  async function handleFace() {

  }

  return (
    <main className="grid grid-cols-3 h-screen overflow-hidden">

      <div className="col-span-2 bg-slate-100 flex flex-col items-center justify-center">

        <form className="flex flex-col" onSubmit={handleSubmit(handleRegisterAuth)}>
          <div className="flex gap-2">
            <Image src={webcam} className="title w-[32px] opacity-0" alt="Webcam" />
            <h1 className='title opacity-0 text-2xl font-semibold text-slate-600'>Bem vindo ao AccessCore</h1>
          </div>
          <span className='title opacity-0 text-sm text-center text-slate-400'>Faça login para continuar</span>

          <Input
            className="px-3 py-2 mt-10"
            type="text"
            name='email'
            placeholder='Email'
            error={errors.email?.message}
            register={register}
          />

          <Input
            className="px-3 py-2 mt-4"
            type="password"
            name='password'
            placeholder='Senha'
            error={errors.password?.message}
            register={register}
          />

          <button
            type="submit"
            className="text-sm px-3 py-2 mt-4 rounded-lg 
                      bg-[#4f46e5] font-medium text-white 
                      hover:bg-[#4f46e5]/50 focus:bg-[#4f46e5]/50">
            Acessar
          </button>

          <Link
            href="/face"
            className="text-sm px-3 py-2 mt-4 rounded-lg text-center 
                      bg-[#4f46e5] font-medium text-white 
                      hover:bg-[#4f46e5]/50 focus:bg-[#4f46e5]/50">
            Acessar com face
          </Link>

          <div className="mt-4">
            <span className="text-sm text-slate-500">
              Ainda não possui acesso?
              <Link href="/account" className="ml-1 text-[#4f46e5] transition-colors hover:text-[#4f46e5]/50">
                Cadastrar
              </Link>
            </span>
          </div>
        </form>

      </div>
      <div className="relative col-span-1 bg-[#4f46e5] flex flex-col items-center justify-center">
        <Image priority={true} quality={100} className="baner opacity-0 -ml-[200px] w-96 object-cover rounded-3xl" src={baner} alt="Web cam" />
      </div>
    </main >
  )
}