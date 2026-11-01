# Helpdesk Light (NestJS)

A small helpdesk ticket API built with NestJS, runnable locally, with Docker Compose, or on Kubernetes (minikube).

All routes are prefixed with `/api` (see `src/main.ts`).

| Method | Route              | Description     |
| ------ | ------------------ | --------------- |
| GET    | `/api`             | App root        |
| GET    | `/api/tickets`     | List tickets    |
| GET    | `/api/tickets/:id` | Get one ticket  |
| POST   | `/api/tickets`     | Create a ticket |

Ticket body: `subject` (string), `description` (string), `priority` (`low` | `medium` | `high`).

---

## 1. Run locally

```bash
npm install
npm run start:dev        # watch mode
```

Open http://localhost:3000/api

---

## 2. Run with Docker Compose

```bash
docker compose up --build -d
```

Open http://localhost:3005/api (host port `3005` maps to container port `3000`).

Stop:

```bash
docker compose down
```

---

## 3. Run on Kubernetes (minikube)

### Step 1 — Start minikube

```bash
minikube start
```

### Step 2 — Build the image

```bash
docker build -t helpdesk-light-nestjs_app:latest .
```

### Step 3 — Load the image into minikube

minikube has its own Docker daemon, so the image must be copied into it.

```bash
minikube image load helpdesk-light-nestjs_app:latest
minikube image ls | grep helpdesk     # verify it is there
```

> Alternative to steps 2–3: build directly inside minikube
>
> ```bash
> eval $(minikube docker-env)
> docker build -t helpdesk-light-nestjs_app:latest .
> ```

### Step 4 — Apply the manifests

```bash
kubectl apply -f deployment.yaml -f service.yaml
```

### Step 5 — Wait for pods to be ready

```bash
kubectl get pods -w      # wait for 2 pods: Running 1/1, then Ctrl+C
```

### Step 6 — Get the URL

```bash
minikube service helpdesk-light-nestjs-app --url
```

Prints something like `http://192.168.49.2:30080`. Remember to add `/api`:

```bash
curl http://192.168.49.2:30080/api/tickets

curl -X POST http://192.168.49.2:30080/api/tickets \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test","description":"Hello","priority":"low"}'
```

---

## Updating after code changes

```bash
docker build -t helpdesk-light-nestjs_app:latest .
minikube image load helpdesk-light-nestjs_app:latest
kubectl rollout restart deploy/helpdesk-light-nestjs-app
```

After changing only the YAML files:

```bash
kubectl apply -f deployment.yaml -f service.yaml
```

---

## Troubleshooting

| Symptom                       | Cause / Fix                                                         |
| ----------------------------- | ------------------------------------------------------------------- |
| `Cannot GET /`                | Normal — routes start with `/api`. Use `/api` or `/api/tickets`.     |
| `ErrImageNeverPull`           | Image not inside minikube. Redo Step 3.                             |
| `CrashLoopBackOff`            | App crashing. Check logs: `kubectl logs deploy/helpdesk-light-nestjs-app` |
| Created ticket "disappears"   | 2 replicas each keep their own in-memory data. For testing: `kubectl scale deploy/helpdesk-light-nestjs-app --replicas=1` |

Useful commands:

```bash
kubectl get all                                   # see deployment, pods, service
kubectl describe pod <pod-name>                   # detailed pod events
kubectl logs -f deploy/helpdesk-light-nestjs-app  # follow logs
```

---

## Cleanup

```bash
kubectl delete -f deployment.yaml -f service.yaml   # remove app from cluster
minikube stop                                       # stop the cluster
```

---

## Kubernetes files

- `deployment.yaml` — 2 replicas, image `helpdesk-light-nestjs_app:latest`, `imagePullPolicy: Never` (uses the local image, never pulls), container port `3000`, CPU/memory limits.
- `service.yaml` — `NodePort` service, exposes port `3000` on node port `30080`.

> Note: Kubernetes object names (`metadata.name`, labels) must use `-`, not `_`. Docker image names may use `_`.
