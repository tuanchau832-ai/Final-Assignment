# CITP GitHub workflow for HanoiWaterWatch

Repository: [`tuanchau832-ai/Final-Assignment`](https://github.com/tuanchau832-ai/Final-Assignment)

| Role | Where you work | How changes reach `main` |
| --- | --- | --- |
| Team member | Your assigned branch, such as `feature/ngan` | Push your branch and open a pull request (PR) to `main`. Update that PR when the leader requests changes. |
| Team leader | `main` for your own changes and the PR page for teammate contributions | Review and merge team PRs. Push your own verified changes directly to `main` when the repository settings allow it. |

## 1. Set up Git and VS Code

1. Accept the GitHub collaborator invitation using the account that should push to the team repository.
2. If you already cloned the repository, open that clone in VS Code. To clone it for the first time, run these commands in a VS Code terminal.

   ```bash
   git clone https://github.com/tuanchau832-ai/Final-Assignment.git
   cd Final-Assignment
   ```

3. Verify that `origin` points to `tuanchau832-ai/Final-Assignment`. Set your commit name and email for this clone if needed.

   ```bash
   git remote -v
   git config user.name "Your Name"
   git config user.email "your-verified-email@example.com"
   ```

   Git uses these settings for commit attribution. GitHub checks push access against the account authenticated by your Git client. If a push returns `Permission to tuanchau832-ai/Final-Assignment.git denied to <username>`, check that `<username>` has accepted the invite, then switch to the invited account in the Git credential prompt if needed.

## 2. Team member workflow

### Start on your branch

Run `git status --short` before switching branches. Commit or stash any unfinished changes on the branch they belong to. Use your assigned branch name in place of `feature/ngan` when working on a different task.

If you already have a local copy of Ngân's branch, synchronize it with its GitHub branch and then bring in the latest `main`.

```bash
git switch feature/ngan
git fetch origin
git pull --ff-only origin feature/ngan
git merge origin/main
```

If the branch exists on GitHub and this is your first time using it locally, run `git fetch origin` and `git switch --track origin/feature/ngan` in place of the first two commands. If `git pull --ff-only` reports that your branch has diverged, stop there and inspect both histories. Coordinate with anyone who pushed to the branch before integrating their commits.

For a new task, start a fresh branch from the latest `main`. `feature/readme-setup` is an example name for a future task involving the repository's `README.md`.

```bash
git fetch origin
git switch --no-track -c feature/readme-setup origin/main
```

### Commit and push the files you changed

For an edit to the blueprint index on `feature/ngan`, preview the rendered Markdown and check links to the blueprint sections. Then stage the exact file and push your branch.

```bash
git status --short
git diff -- HanoiWaterWatch/docs/blueprint/README.md
git add -- HanoiWaterWatch/docs/blueprint/README.md
git diff --cached
git commit -m "Docs: clarify the HanoiWaterWatch blueprint index"
git push origin feature/ngan
```

For the first push of a new branch, set its upstream, for example with `git push -u origin feature/readme-setup`. Keep `.env` files, API keys, passwords, and unrelated edits out of the commit.

### Open or update the pull request

1. Open the repository's [Pull requests page](https://github.com/tuanchau832-ai/Final-Assignment/pulls) and choose **New pull request**.
2. Choose `main` as **base** and your task branch as **compare**. Inspect the file list and diff before submitting.
3. Include the scope, what you checked, and any other branch that the change depends on. Request review from the team leader.
4. If a PR already exists for the task, push follow-up commits to the same branch. GitHub adds them to that PR automatically.

The team already has a working example in [PR #1, “Docs: add implementation blueprint”](https://github.com/tuanchau832-ai/Final-Assignment/pull/1). It proposes merging `feature/ngan` into `main` and adds the blueprint under `HanoiWaterWatch/docs/blueprint/`. For a review follow-up on that task, Ngân would push to `feature/ngan` and continue in PR #1.

If Git reports a conflict while merging `origin/main`, run `git status` and open the listed files in VS Code's Merge Editor. Coordinate with the author when the same lines contain both teammates' changes. Stage the resolved files, run `git diff --cached --check`, verify the result, and finish with `git commit` before pushing. Use `git merge --abort` if you need to return to the state before the merge and started with a clean working tree.

Once your PR is merged, update local `main` with `git switch main` followed by `git pull --ff-only origin main`. Use the fresh-branch steps above for your next task.

## 3. Team leader workflow

### Review and merge team PRs

1. Open the PR and confirm the source branch and the `main` target. For [PR #1](https://github.com/tuanchau832-ai/Final-Assignment/pull/1), the source is `feature/ngan`.
2. In **Files changed**, check scope and dependencies. For PR #1, start with `HanoiWaterWatch/docs/blueprint/README.md` and review `02-architecture.md`, `03-3d-integration.md`, and `04-wokwi-integration.md` in the same folder where the blueprint discusses how the pieces fit together.
3. Verify the changes locally when needed and check any GitHub status checks. For the blueprint, preview the rendered Markdown and follow the section links. For the 3D model or simulator, follow the checks in the table below.
4. Request changes if a check fails or the PR has a conflict. The author can resolve it on their branch and push an update. When the PR is ready, select an available merge method in GitHub and confirm the merge.
5. Verify that GitHub shows the PR as **Merged** and refresh your local `main`. Let the team know when a merge changes a shared file or integration point.

To inspect PR #1 locally, start with a clean working tree, fetch the branches, and check out the PR commit for testing. Switch back and synchronize `main` after you finish reviewing or after a merge on GitHub.

```bash
git fetch origin
git diff --stat origin/main...origin/feature/ngan
git switch --detach origin/feature/ngan
# Preview HanoiWaterWatch/docs/blueprint/README.md in VS Code and check its links.
git switch main
git pull --ff-only origin main
```

### Push your own changes to `main`

For a leader-owned edit to the real `README.md`, update `main` before editing, preview the resulting Markdown, and review both the staged changes and the commits about to be pushed.

```bash
git switch main
git status --short
# Start from a clean working tree.
git pull --ff-only origin main
# Edit README.md in VS Code.
git add -- README.md
git diff --cached
git diff --cached --check
git commit -m "Docs: add HanoiWaterWatch project setup to README"
git fetch origin
git log --oneline origin/main..HEAD
git push origin main
```

If `main` advanced on GitHub and the push is rejected, fetch again and inspect `git log --left-right --oneline main...origin/main`. For your own unpublished commits, `git rebase origin/main` can replay them on the updated `main`. Resolve and recheck the changes before retrying a normal push. Keep shared history intact by avoiding force pushes. If repository rules require a PR, publish the change from a separate branch and use the PR workflow.

## 4. Real CITP branch examples

| Verified branch | Files in the repository | What to check before merging |
| --- | --- | --- |
| [`feature/ngan`](https://github.com/tuanchau832-ai/Final-Assignment/tree/feature/ngan) | `HanoiWaterWatch/docs/blueprint/README.md` and the numbered blueprint documents | Preview the Markdown index, follow its links, and check that integration details agree across the relevant sections. [PR #1](https://github.com/tuanchau832-ai/Final-Assignment/pull/1) |
| [`model-tram-do`](https://github.com/tuanchau832-ai/Final-Assignment/tree/model-tram-do) | `index.html`, `script.js`, `style.css` | Serve the checked-out branch locally, open `index.html`, and check that the station model renders, responds to input, and loads its assets without console errors. |
| [`tram-cam-bien-ao`](https://github.com/tuanchau832-ai/Final-Assignment/tree/tram-cam-bien-ao) | `Simulation.html`, `Simulation.css`, `ESP32 Simulator - Trạm ST-TOLICH-01.md` | Serve the branch locally, open `Simulation.html`, and verify the styling and one simulator interaction using the setup documented on that branch. |
| [`main`](https://github.com/tuanchau832-ai/Final-Assignment/tree/main) | `README.md`, `GITHUB_TEAM_WORKFLOW.md` | Preview Markdown edits, check links, and verify the intended commit appears on GitHub. |

For the browser checks above, you can run `python -m http.server 8000` from the checked-out branch if Python is installed. Open `http://localhost:8000/index.html` for the model or `http://localhost:8000/Simulation.html` for the simulator. If the change depends on both branches, test their integration before merging it into `main`.

GitHub references for [creating a pull request](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request) and [merging a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/merging-a-pull-request).
