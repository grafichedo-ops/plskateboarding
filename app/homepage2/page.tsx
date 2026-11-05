import { redirect } from "next/navigation";

/** /homepage2 ora e' la homepage: i vecchi link portano a `/`. */
export default function Homepage2Redirect() {
  redirect("/");
}
