"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dispatch, FormEvent, SetStateAction } from "react"


interface LoginFormType {
	setLoginDialogOpen: Dispatch<SetStateAction<boolean>>
}

export function LoginForm({setLoginDialogOpen}:LoginFormType) {

 
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')
 
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
 
    if (response.ok) {
			setLoginDialogOpen(false)
    } else {
      // Handle errors
    }
  }



  return (
      <Card>
        <CardHeader>
          <CardTitle>CONNECTE TOI</CardTitle>
          <CardDescription>
            Aller stp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">C'EST QUOI TON NOM</Label>
                <Input
                  id="username"
									name="username"
                  type="text"
                  placeholder="Kabil"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">C'EST QUOI TON MOT DE PASSE</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    T'AS OUBLIÉ??????
                  </a>
                </div>
                <Input id="password" type="password" name="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full  cursor-pointer">
                  Connexion
                </Button>
    
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              
              <a href="#" className="underline underline-offset-4">
                CREE TON COMPTE COPAING
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
  )
}
