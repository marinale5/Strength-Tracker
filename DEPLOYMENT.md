# 🚀 Deployment Guide

This guide helps you deploy Strength Tracker to production.

---

## System Architecture

```
┌─────────────────────────────┐
│     Users' Mobile Phones    │
│   (iOS/Android via Expo)    │
└──────────────┬──────────────┘
               │ HTTPS
               │ (REST API calls)
               ▼
    ┌──────────────────────┐
    │   CDN / Load         │
    │   Balancer           │
    │   (CloudFlare)       │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │   Node.js Backend    │
    │   (Express.js)       │
    │   (Multiple servers) │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │   PostgreSQL DB      │
    │   (Managed Service)  │
    │   (With backups)     │
    └──────────────────────┘
```

---

## Deployment Options

### Option 1: Heroku (Easiest, Best for Learning)

**Backend Deployment:**

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku app**
   ```bash
   cd backend
   heroku create strength-tracker-api
   ```

3. **Create PostgreSQL database**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET=your_super_secret_key
   heroku config:set GOOGLE_CLIENT_ID=your_google_client_id
   heroku config:set GOOGLE_CLIENT_SECRET=your_google_client_secret
   heroku config:set GITHUB_CLIENT_ID=your_github_client_id
   heroku config:set GITHUB_CLIENT_SECRET=your_github_client_secret
   heroku config:set NODE_ENV=production
   ```

5. **Update callback URLs in OAuth apps:**
   - Google: Add `https://strength-tracker-api.herokuapp.com/auth/google/callback`
   - GitHub: Add `https://strength-tracker-api.herokuapp.com/auth/github/callback`

6. **Deploy**
   ```bash
   git push heroku main
   heroku logs --tail
   ```

**Frontend Configuration:**

1. **Update API URL**
   ```
   In frontend/.env:
   EXPO_PUBLIC_API_URL=https://strength-tracker-api.herokuapp.com
   ```

2. **Generate EAS build** (if on Expo)
   ```bash
   cd frontend
   eas build --platform ios --auto-submit
   eas build --platform android --auto-submit
   ```

3. **Submit to App Stores**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

---

### Option 2: DigitalOcean App Platform

**Backend Deployment:**

1. **Create app.yaml** in backend root:
   ```yaml
   name: strength-tracker-api
   services:
   - name: api
     github:
       repo: your-username/Strength-Tracker
       branch: main
       deploy_on_push: true
     build_command: npm install
     run_command: npm run start
     envs:
     - key: PORT
       value: "5000"
     - key: NODE_ENV
       value: production
     - key: JWT_SECRET
       scope: RUN_AND_BUILD_TIME
       value: ${JWT_SECRET}
   databases:
   - name: postgres
     version: "12"
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add deployment config"
   git push origin main
   ```

3. **Create app on DigitalOcean**
   - Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Select GitHub repo
   - Set environment variables
   - Deploy

---

### Option 3: AWS (Most Scalable)

**Backend Deployment:**

1. **Create EC2 instance**
   ```bash
   # Ubuntu 20.04 LTS, t2.micro (free tier eligible)
   ```

2. **SSH into instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install Node.js and database**
   ```bash
   curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install nodejs postgresql postgresql-contrib
   sudo systemctl start postgresql
   ```

4. **Clone repository**
   ```bash
   git clone https://github.com/your-username/Strength-Tracker.git
   cd Strength-Tracker/backend
   npm install
   ```

5. **Create .env file**
   ```bash
   nano .env
   # Copy contents from .env.example
   # Update with production values
   ```

6. **Run database setup**
   ```bash
   psql -U postgres < src/migrations/init.sql
   psql -U postgres strength_tracker < src/migrations/seedExercises.sql
   ```

7. **Create systemd service** for auto-restart:
   ```bash
   sudo nano /etc/systemd/system/strength-tracker.service
   ```

   ```ini
   [Unit]
   Description=Strength Tracker API
   After=network.target

   [Service]
   User=ubuntu
   WorkingDirectory=/home/ubuntu/Strength-Tracker/backend
   ExecStart=/usr/bin/npm start
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

   ```bash
   sudo systemctl enable strength-tracker
   sudo systemctl start strength-tracker
   ```

8. **Set up Nginx as reverse proxy**
   ```bash
   sudo apt-get install nginx
   sudo nano /etc/nginx/sites-available/default
   ```

   ```nginx
   server {
       listen 80 default_server;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo systemctl restart nginx
   ```

9. **Enable HTTPS with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Production Checklist

- [ ] **Environment Variables**: All set on production server
- [ ] **Database**: On managed service (Heroku PostgreSQL, AWS RDS)
- [ ] **SSL Certificate**: HTTPS enabled (Let's Encrypt or AWS ACM)
- [ ] **Backups**: Automated daily or more frequent
- [ ] **Logs**: Centralized logging (CloudWatch, Papertrail)
- [ ] **Monitoring**: Uptime monitoring (Uptimerobot, StatusPage)
- [ ] **Security**: Rate limiting, CORS configured, JWT secret rotated
- [ ] **Database Migrations**: Run before deploying
- [ ] **API Rate Limits**: Implemented for public endpoints
- [ ] **CORS**: Only allow frontend domains
- [ ] **Error Logging**: Debug without exposing sensitive info
- [ ] **Performance**: Database indexes created
- [ ] **OAuth**: Redirect URIs updated for production domain

---

## Environment Variables (Production)

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/strength_tracker
# or individually:
DB_HOST=strength-tracker-db.xxxxx.rds.amazonaws.com
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=your_secure_password
DB_NAME=strength_tracker

# Authentication
JWT_SECRET=very_long_random_secret_string_min_32_chars
JWT_EXPIRATION=86400  # 24 hours

# OAuth (Google)
GOOGLE_CLIENT_ID=123456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxxxxxxxx
GOOGLE_CALLBACK_URL=https://api.yourdomain.com/auth/google/callback

# OAuth (GitHub)
GITHUB_CLIENT_ID=xxxxxxxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxxx
GITHUB_CALLBACK_URL=https://api.yourdomain.com/auth/github/callback

# Server Config
PORT=5000
NODE_ENV=production
SESSION_SECRET=another_random_secret

# CORS
FRONTEND_URL=https://app.yourdomain.com
```

---

## Monitoring Production

### Database Health
```bash
# Connect to production database
psql $DATABASE_URL

# Check table sizes
\dt+

# Check index usage
SELECT * FROM pg_stat_user_indexes;

# Check slow queries
SELECT query, mean_time
FROM pg_stat_statements
WHERE mean_time > 100
ORDER BY mean_time DESC;
```

### Backend Health
```bash
# Check process
pm2 monit  # or systemctl status strength-tracker

# Check logs
tail -f /var/log/strength-tracker.log

# Monitor resources
htop
```

### API Monitoring
```bash
# Test health endpoint
curl https://api.yourdomain.com/health

# Monitor endpoints
New Relic / Datadog dashboard
```

---

## Scaling Strategy

### Phase 1: MVP (Single Server)
- 1 EC2/Heroku instance
- Single PostgreSQL database
- Cloudflare for CDN

### Phase 2: Moderate Growth (50K+ users)
- 2-3 load-balanced backend servers
- PostgreSQL with read replicas
- Redis cache layer
- CloudFront CDN

### Phase 3: Enterprise (500K+ users)
- Auto-scaling backend (5-10 servers)
- PostgreSQL cluster with sharding
- Memcached/Redis for caching
- Message queue (RabbitMQ, Kafka)
- Separate analytics service

---

## Disaster Recovery

### Automated Backups
```bash
# Database backups (Daily)
pg_dump strength_tracker > backup_$(date +%Y%m%d).sql

# Upload to S3
aws s3 cp backup_*.sql s3://my-backups/

# Restore from backup
psql strength_tracker < backup_20240115.sql
```

### Failover Strategy
1. **Database Failover**: Use AWS RDS Multi-AZ or managed PostgreSQL with standby
2. **Server Failover**: Use load balancer with health checks
3. **DNS Failover**: Route53 health checks to switch between regions

---

## Cost Estimation (Monthly)

### Option 1: Heroku
- Dyno (Free tier): $0
- PostgreSQL (Hobby Basic): $9
- **Total: $9/month**

### Option 2: DigitalOcean
- App Platform (Starter): $5
- Database (Starter): $15
- **Total: $20/month**

### Option 3: AWS (Moderate load)
- EC2 (t2.small): $20
- RDS (db.t2.micro): $20
- NAT Gateway: $32
- **Total: $72/month**

---

## Post-Deployment

1. **Monitor metrics** for first week
2. **Respond to user feedback** and bugs
3. **Optimize database queries** if slow
4. **Plan upgrades** based on usage
5. **Implement analytics** to track user behavior
6. **Set up alerts** for errors/downtime

---

## Troubleshooting Deployment Issues

### Backend won't start
```bash
# Check logs
heroku logs --tail  # or server logs

# Verify environment variables
heroku config  # or echo $DATABASE_URL

# Check database connection
npm run verify
```

### Frontend can't reach backend
```bash
# Verify API URL
echo $EXPO_PUBLIC_API_URL

# Test endpoint
curl https://api.yourdomain.com/health

# Check CORS settings
# Verify frontend domain in backend CORS config
```

### Database connection pool exhausted
```bash
# Increase pool size in database.js
max: 20  // increase from default

# Kill idle connections
SELECT * FROM pg_stat_activity;
SELECT pg_terminate_backend(pid) WHERE state='idle';
```

---

**Need help?** Check logs first, then ask for debugging specific errors!
