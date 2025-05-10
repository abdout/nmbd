import Link from "next/link";
import { fathers } from "@/components/site/father/constant";

export default function AllFathersPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl mb-6">Father ID Navigation Test Page</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl">HTML Links (Regular)</h2>
        <ul className="list-disc pl-6">
          {fathers.map((father) => (
            <li key={father.id} className="mb-2">
              <a href={`/father/${father.id}`} className="text-blue-500 underline">
                {father.name} - Using HTML a tag - ID: {father.id}
              </a>
            </li>
          ))}
        </ul>

        <h2 className="text-xl mt-8">Next.js Links</h2>
        <ul className="list-disc pl-6">
          {fathers.map((father) => (
            <li key={father.id} className="mb-2">
              <Link href={`/father/${father.id}`} className="text-green-500 underline">
                {father.name} - Using Next.js Link - ID: {father.id}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
