#!/bin/bash

# --- Colors for pretty output ---
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${PURPLE}==============================================${NC}"
echo -e "${PURPLE}   Selenium to Playwright Converter Launcher   ${NC}"
echo -e "${PURPLE}==============================================${NC}"

# 1. Check for Ollama
echo -e "${BLUE}[1/4] Checking Ollama Status...${NC}"
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo -e "${YELLOW}⚠️  Ollama is not running locally.${NC}"
    echo -e "Please start Ollama and run 'ollama pull codellama' for AI features."
else
    echo -e "${GREEN}✅ Ollama is online.${NC}"
fi

# 2. Install dependencies if needed
echo -e "${BLUE}[2/4] Verifying Dependencies...${NC}"
if [ ! -d "server/node_modules" ]; then
    echo -e "${CYAN}Installing server dependencies...${NC}"
    cd server && npm install && cd ..
fi
if [ ! -d "client/node_modules" ]; then
    echo -e "${CYAN}Installing client dependencies...${NC}"
    cd client && npm install && cd ..
fi

# 3. Start Backend & Frontend
echo -e "${BLUE}[3/4] Launching Services...${NC}"

# Kill any existing processes on these ports just in case
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null

echo -e "${CYAN}🚀 Starting Backend (Port 3000)...${NC}"
node server/index.js > /dev/null 2>&1 &
BACKEND_PID=$!

echo -e "${CYAN}🚀 Starting Frontend (Port 5173)...${NC}"
cd client && npm run dev > /dev/null 2>&1 &
FRONTEND_PID=$!
cd ..

# 4. Open Browser
echo -e "${BLUE}[4/4] Opening Browser...${NC}"
sleep 5 # Give it a few seconds to warm up
open http://localhost:5173

echo -e "${PURPLE}==============================================${NC}"
echo -e "${GREEN}✨ Application is LIVE at http://localhost:5173${NC}"
echo -e "${YELLOW}Press [Ctrl+C] to stop all services and exit.${NC}"
echo -e "${PURPLE}==============================================${NC}"

# Handle cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping services...${NC}"
    kill $BACKEND_PID
    kill $FRONTEND_PID
    echo -e "${GREEN}Done. Goodbye!${NC}"
    exit
}

trap cleanup SIGINT

# Keep the script running so trap works
wait
