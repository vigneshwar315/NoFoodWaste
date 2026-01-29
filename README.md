[No Food waste] chennai origin

Core Objective:
Minimize food wastage and maximize timely redistribution

the core problems faced by the NGO:
  numerous calls
  no analytics of data
  golden time period
  
The system revolves around 4 main entities:

1. Donor
Households / restaurants / events / institutions
Interact with system via automated voice call
Provide:
  Food type
  Quantity
  Location

2. Backend System (YOU)
  Central brain 
  Receives donor data
  Makes decisions
  Assigns resources
  Tracks lifecycle

3. Driver
  Delivery personnel
  Assigned automatically
  Route optimized

4. Hunger Spot
Predefined locations (NGOs, shelters, orphanages)
Receive food

Have:
Capacity
Location
Priority (implicit)

High-Level System Flow (End-to-End)

Step 1: Donor Initiation
Donor gets automated Exotel voice call
Speech recognition captures:
Food type
Quantity
Location

Step 2: Validation
Backend checks:
Is quantity sufficient?
Is food type acceptable?
If ❌ → call ends politely
If ✅ → donation is created

Step 3: Matching Logic
Backend finds:
Nearby hunger spots
Available drivers
Filters based on:
Distance
Time constraints

Step 4: Route Optimization
Google Maps API calculates:
Driver → Donor
Donor → Hunger Spot
ETA is computed

Step 5: Assignment
Best driver is assigned
Hunger spot is selected
Donation moves to “In Progress”

Step 6: Completion

Food delivered

Status updated

Data logged for analytics
