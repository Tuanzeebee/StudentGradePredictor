# Copilot Instructions for Student Grade Predictor

## Project Overview
This is a **Student Grade Predictor** system with three main components:
- **Backend**: NestJS API with Prisma ORM and PostgreSQL
- **Frontend**: React + TypeScript with Vite
- **ML Service**: FastAPI service for grade prediction models

## Project Architecture

### Backend (NestJS)
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport
- **File Upload**: Multer for CSV processing
- **Architecture**: Clean Architecture with modules, controllers, services, DTOs

#### Key Modules:
1. **Auth Module**: JWT authentication with guards and strategies
2. **Score Module**: Grade prediction and CSV import functionality
3. **User Module**: User management
4. **Post Module**: Content management

#### Database Schema (Prisma):
- `User`: User accounts with email, password, name
- `Post`: Content posts linked to users
- `ScoreRecord`: Student grade records with semester data
- `PredictedScore`: ML model predictions

### Frontend (React)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Components**: ScoreChart, UploadFile, Landing page
- **API Integration**: Axios for backend communication

### ML Service (FastAPI)
- **Framework**: FastAPI with Python
- **Models**: MLPRegressor and XGBoost for grade prediction
- **Main API File**: `predict_api_1.py` (use this instead of predict_api.py)
- **Features**: Reverse engineering of student factors and grade prediction
- **Endpoints**: 
  - `/reverse`: Infers weekly_study_hours from known raw_score
  - `/predict`: Predicts raw_score from study features (auto-calculates interaction features)

## Coding Guidelines

### Backend Development
1. **Module Structure**: Follow NestJS module pattern with controllers, services, DTOs
2. **Authentication**: Use JWT guards for protected routes
3. **Validation**: Use class-validator and class-transformer for DTOs
4. **Database**: Use Prisma Client for all database operations
5. **Error Handling**: Implement proper exception filters
6. **File Processing**: Use multer and csv-parser for CSV imports

### Frontend Development
1. **Components**: Create reusable React components in `/components`
2. **Pages**: Main page components in `/pages`
3. **API**: Centralize API calls in `api.ts`
4. **Types**: Use TypeScript interfaces for type safety
5. **Styling**: Use CSS modules or styled-components

### ML Service
1. **API Design**: RESTful endpoints with Pydantic models
2. **Model Loading**: Load joblib models at startup
3. **Data Processing**: Pandas for data manipulation
4. **CORS**: Enable CORS for frontend integration

## Key Features to Implement

### Score Prediction System
- CSV file upload and processing
- Student data validation and cleaning
- ML model integration for grade prediction
- Historical data analysis
- GPA calculation (current semester and cumulative)

### Authentication & Authorization
- User registration and login
- JWT token management
- Protected routes and guards
- Role-based access control

### Data Management
- CRUD operations for students and scores
- Bulk import from CSV files
- Data export functionality
- Real-time data validation

## File Naming Conventions
- **Controllers**: `*.controller.ts`
- **Services**: `*.service.ts`
- **DTOs**: `*.dto.ts`
- **Guards**: `*.guard.ts`
- **Strategies**: `*.strategy.ts`
- **Modules**: `*.module.ts`
- **Components**: PascalCase (e.g., `ScoreChart.tsx`)

## API Endpoints Structure
```
/auth
  POST /auth/login
  POST /auth/login
  GET /profile

/scores
  POST /import-csv
  GET /
  POST /predict
  GET /analytics

/users
  GET /
  GET /:id
  PUT /:id
  DELETE /:id
```

## Environment Variables
```
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
PORT=3000
ML_SERVICE_URL="http://localhost:8000"
```

## Common Patterns

### Controller Pattern
```typescript
@Controller('endpoint')
@UseGuards(JwtAuthGuard)
export class ExampleController {
  constructor(private readonly service: ExampleService) {}
  
  @Post()
  async create(@Body() dto: CreateDto, @Req() req) {
    return this.service.create(dto, req.user.userId);
  }
}
```

### Service Pattern
```typescript
@Injectable()
export class ExampleService {
  constructor(private readonly prisma: PrismaService) {}
  
  async findAll(userId: number) {
    return this.prisma.model.findMany({
      where: { userId }
    });
  }
}
```

### DTO Pattern
```typescript
export class CreateExampleDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsNumber()
  @IsOptional()
  value?: number;
}
```
## Performance Considerations
- Use Prisma query optimization
- Implement pagination for large datasets
- Cache frequently accessed data
- Optimize CSV processing for large files
- Use background jobs for heavy ML computations

## Security Best Practices
- Validate all inputs with DTOs
- Use parameterized queries (Prisma handles this)
- Implement rate limiting
- Secure file upload validation
- JWT token expiration and refresh
- CORS configuration for production

### How to Start Services:

```bash
# Backend (NestJS) - Port 3000
cd backend && npm run start:dev

# Frontend (React) - Port 5173  
cd frontend && npm run dev

# ML Service (FastAPI) - Port 8000
cd ml_service && python predict_api_1.py
```

## Deployment Notes
- Use environment-specific configurations
- Implement health check endpoints
- Set up proper logging
- Configure database migrations
- Set up ML model versioning
- **Important**: Use `predict_api_1.py` for ML service (not predict_api.py)

When working on this project, prioritize clean code, proper error handling, and maintainable architecture following NestJS and React best practices.
