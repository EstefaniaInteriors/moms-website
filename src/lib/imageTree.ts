/**
 * Returns the repository file tree used by the galleries.
 *
 * Tries GitHub's API first, so photos pushed to GitHub show up without a deploy.
 * If GitHub refuses (it rate-limits shared IPs, including Google's crawler), falls
 * back to /image-tree.json, a copy of the image list written at build time.
 */
const REPO_API = "https://api.github.com/repos/EstefaniaInteriors/moms-website";

export async function fetchImageTree(): Promise<{ tree: { type: string; path: string }[] }> {
  try {
    const branchResponse = await fetch(`${REPO_API}/branches/main`);
    if (!branchResponse.ok) throw new Error(`branch ${branchResponse.status}`);
    const commitSha = (await branchResponse.json()).commit.sha;
    const treeResponse = await fetch(`${REPO_API}/git/trees/${commitSha}?recursive=1`);
    if (!treeResponse.ok) throw new Error(`tree ${treeResponse.status}`);
    return await treeResponse.json();
  } catch (err) {
    console.warn("GitHub image list unavailable, using built-in copy:", err);
    const backup = await fetch("/image-tree.json");
    if (!backup.ok) throw new Error(`Failed to load image list: ${backup.status}`);
    return backup.json();
  }
}
