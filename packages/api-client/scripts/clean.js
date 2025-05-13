import { rm, readdir } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(fileURLToPath(import.meta.url), "..");

const targetDir = join(__dirname, "..", "src");

const WHITELIST = ["lib"];

async function cleanSrc() {
  try {
    const filesAndFolders = await readdir(targetDir);
    for (const item of filesAndFolders) {
      if (!WHITELIST.includes(item)) {
        const itemPath = join(targetDir, item);
        await rm(itemPath, { recursive: true, force: true });
        console.log(`Successfully cleaned ${itemPath}`);
      }
    }
    console.log(
      `Successfully cleaned ${targetDir}, excluding ${WHITELIST.join(", ")}`,
    );
  } catch (error) {
    console.error(`Error cleaning ${targetDir}:`, error);
    // If the directory doesn't exist, it's not an error for our use case.
    if (error.code !== "ENOENT") {
      process.exit(1);
    }
  }
}

cleanSrc();
