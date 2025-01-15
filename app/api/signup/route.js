import { connectDB } from "@lib/mongodb";
import { NextResponse } from "next/server";
import User from "@models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try{
        const { name, email, password } = await req.json();
        const hashPass = await bcrypt.hash(password, 10);
        await connectDB();
        await User.create({name, email, password: hashPass});

        return NextResponse.json({message: "User created successfully"}, {status: 201});
    } catch (error) {
        return NextResponse.json(
            {message: "An error occurred while creating the user"},
            {status: 500}
        );
    }
}