import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import InputGroup from "../components/InputGroup";
import { useAuthState } from "../context/auth";

const Register = () => {
	const router = useRouter();
	const { authenticated } = useAuthState();
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<any>({});

	const submitForm = async (e: FormEvent) => {
		e.preventDefault();

		try {
			await axios.post("/auth/register", {
				username,
				email,
				password,
			});
			router.push("/login");
		} catch (err) {
			console.error(err);
			setErrors(err.response.data);
		}
	};

	if (authenticated) router.push("/");
	return (
		<div className="flex bg-white">
			<Head>
				<title>reddit: Join the worldwide conversation</title>
			</Head>

			<div
				className="h-screen bg-center bg-cover w-36"
				style={{
					backgroundImage: 'url("/images/bricks.jpg")',
				}}
			/>

			<div className="flex flex-col justify-center pl-6">
				<div className="w-70">
					<h1 className="mb-2 text-lg font-medium">Sign Up</h1>
					<p className="mb-10 text-xs">
						By continuing, you agree to our User Agreement and Privacy Policy.
					</p>

					<form onSubmit={submitForm}>
						<InputGroup
							className="mb-2"
							type="text"
							placeholder="Username"
							value={username}
							setValue={(value) => setUsername(value)}
							error={errors.username}
						/>
						<InputGroup
							className="mb-2"
							type="email"
							placeholder="Email"
							value={email}
							setValue={(value) => setEmail(value)}
							error={errors.email}
						/>
						<InputGroup
							className="mb-2"
							type="password"
							placeholder="Password"
							value={password}
							setValue={(value) => setPassword(value)}
							error={errors.password}
						/>

						<button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
							Sign Up
						</button>
					</form>

					<small>
						Already a readitor?{" "}
						<Link href="/login">
							<a className="ml-1 text-blue-500 uppercase">Login</a>
						</Link>
					</small>
				</div>
			</div>
		</div>
	);
};

export default Register;
