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
import { Dispatch, FormEvent, SetStateAction, useState } from "react"


interface LoginFormType {
	setLoginDialogOpen: Dispatch<SetStateAction<boolean>>
}

enum FormType {
	LOGIN,
	SIGNUP
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
	const [formType, setFormType] = useState<FormType>(FormType.LOGIN)
	const [signupUsername, setSignupUsername] = useState<string>("")
	const [signupPassword, setSignupPassword] = useState<string>("")

	const handleUsernameChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setSignupUsername(event.target.value)
	}

	const handlePasswordChange = (event:React.ChangeEvent<HTMLInputElement>) => {
		setSignupPassword(event.target.value)
	}


	const handleSignupSubmit = async () => {
		if (signupUsername!="" && signupPassword!="") {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(
					{
						username: signupUsername,
						password: signupPassword
					}
				),
			})
			if (response.ok) {
				setLoginDialogOpen(false)
			} else {
				// Handle errors
			}
		}

	}


  return (
      <Card className="m-10">
				{
					formType == FormType.LOGIN
					?
						<>
							<CardHeader>
								<CardTitle>CONNECTES TOI</CardTitle>
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
										
										<button onClick={() => setFormType(FormType.SIGNUP)} className="underline underline-offset-4 cursor-pointer">
											CREES TON COMPTE COPAING
										</button>
									</div>
								</form>
							</CardContent>
						</>
					:
						null
				}
				{
					formType == FormType.SIGNUP
					?
						<>
							<CardHeader>
								<CardTitle>CREE TON COMPTE HIHIHI</CardTitle>
								<CardDescription>
									Yipeeeeeee
								</CardDescription>
							</CardHeader>
							<CardContent>
									<div className="flex flex-col gap-6">
										<div className="grid gap-3">
											<Label htmlFor="email" className="font-bold">TU VEUX T'APPELER COMMENT?????</Label>
											<Input value={signupUsername} onChange={handleUsernameChange}/>
										</div>
										<div className="grid gap-3">
											<div className="flex items-center">
												<Label htmlFor="password" className="flex flex-col items-start">
													<span className="font-bold">METS UN MOT DE PASSE</span>
													<span className="text-xs">(pas un vrai, c'est pas sécurisé)</span>
													<span className="text-xs">(c'est stocké en dur en base)</span>
													<span className="text-xs">(j'avais la flemme)</span>
													<span className="text-xs">(y'a aucune contraine, tu peux juste mettre 123 ou pipi si tu veux)</span>
												</Label>
											</div>
											<Input type="password" value={signupPassword} onChange={handlePasswordChange} />
										</div>
										<div className="flex flex-col gap-3">
											<Button onClick={handleSignupSubmit} className="w-full  cursor-pointer">
											CREES TON CROUSTICOMPTE
											</Button>
					
										</div>
									</div>
									<div className="mt-4 text-center text-sm">
										
										<button onClick={() => setFormType(FormType.LOGIN)} className="underline underline-offset-4 cursor-pointer">
											TU VEUX PLUS???????
										</button>
									</div>
							</CardContent>
						</>
					:
						null
				}
        
      </Card>
  )
}
