import { Certificate } from "@/certificate";
import { NfeWebServices } from "@/dfe/nfe";

const status = new NfeWebServices({
	env: "qa",
	uf: "DF",
	certificate: new Certificate(),
});
