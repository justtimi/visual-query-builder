:rocket: Frontend Wizards — Stage 8 @channel
One Last Dance: Build a Visual Query Builder with Next.js

:dart: Objective
Build a highly interactive visual query builder that allows users to construct complex database/API queries through a graphical interface instead of writing raw query syntax manually.
Think:
Postman query builders
Supabase filters
MongoDB Compass
GraphQL explorers
advanced admin filtering systems
Users should be able to:
visually create filters
group conditions
nest logic
preview generated queries
execute simulated queries
inspect results dynamically
This challenge evaluates:
recursive UI engineering
complex state management
schema-driven rendering
frontend systems architecture
interaction engineering
scalability

:brain: What the Application Should Do
The application should allow users to:
choose a data source/schema
visually construct queries
nest logical conditions
dynamically add/remove rules
preview generated query syntax
simulate query execution
inspect returned results
The system should support advanced nested logic like:
(age > 18 AND country = "Nigeria")
OR
(status = "active" AND purchases > 10)

without requiring users to write raw query syntax manually.

:jigsaw: Required Features

:one: Dynamic Query Rule Builder
Users must be able to create query rules visually.
Each rule should contain:
field selector
operator selector
value input
Example:
Field: Age
Operator: Greater Than
Value: 18

Supported operators should include:
equals
not equals
contains
starts with
greater than
less than
in array
between
Bonus:
regex
null checks
date comparisons

:two: Nested Condition Groups
Users must be able to create nested groups.
Supported logic:
AND
OR
Example:
Group A
 ├── Condition 1
 ├── Condition 2
 └── Nested Group
      ├── Condition 3
      └── Condition 4

Requirements:
unlimited nesting depth
collapsible groups
add/remove conditions dynamically
reorder conditions/groups
This is one of the most important evaluation areas.

:three: Schema-Driven Query System
The query builder must adapt dynamically based on a provided schema.
Example schema:
{
  name: "string",
  age: "number",
  status: "enum",
  createdAt: "date"
}

The UI should:
render correct input types
restrict invalid operators
validate values
generate context-aware controls
Examples:
date picker for dates
number inputs for numeric fields
dropdowns for enums

:four: Live Query Preview
As users build queries, the application must generate:
• SQL-like syntax
OR
• Mongo-style query objects
OR
• GraphQL filters
Example:
SELECT * FROM users
WHERE age > 18
AND status = 'active'

OR:
{
  "age": { "$gt": 18 },
  "status": "active"
}

The preview must update in real time.

:five: Query Execution Simulator
Users must be able to:
execute queries
filter a dataset
inspect matching results
Requirements:
mock dataset support
dynamic filtering
result count display
loading states
empty states
Bonus:
pagination
sorting
virtualization

:six: State Management Architecture
This challenge heavily evaluates frontend architecture.
Expected:
normalized query tree structure
recursive state handling
reusable abstractions
immutable updates
scalable architecture

:seven: Recursive Component Engineering
The UI must support recursive rendering.
You will likely need:
recursive condition groups
recursive query parsing
recursive tree traversal
Your implementation should remain:
maintainable
performant
extensible

:eight: Query Validation Engine
The system must:
prevent invalid queries
validate incompatible operators
handle empty states gracefully
surface validation errors clearly
Examples:
prevent “contains” on numbers
prevent invalid date ranges
prevent empty nested groups

:nine: Performance Optimization
Your application will be tested with:
deeply nested conditions
large datasets
many rules/groups
You must optimize:
unnecessary re-renders
recursive updates
query parsing
rendering performance
Expected techniques:
memoization
derived state
stable keys
component isolation

:keycap_ten: Advanced Interactions
Include all of the following:
:white_check_mark: Drag-and-drop condition reordering
:white_check_mark: Keyboard shortcuts
:white_check_mark: Collapsible groups
:white_check_mark: Query history
:white_check_mark: Saved query presets
:white_check_mark: Export/import query JSON
:white_check_mark: Dark/light mode
:white_check_mark: Animated transitions

:test_tube: Testing Requirements
You must implement unit and integration tests for critical parts of the application.
At minimum, tests should cover:
query generation logic
recursive condition/group rendering
validation engine behavior
state management logic
utility/helper functions
critical UI interactions
Suggested tools:
Vitest
Jest
React Testing Library
Cypress or Playwright (optional)
Your tests should demonstrate:
correctness
edge-case handling
maintainability
confidence in your architecture
The focus is not on test quantity alone, but on meaningful test coverage for complex systems behavior.

:rocket: Continuous Deployment (CD) Requirements
You must configure automatic deployment using one of the following:
Vercel
Netlify
Your deployment pipeline must:
automatically deploy changes from your repository
generate preview deployments for pull requests
maintain a stable production deployment
The live deployed URL must remain accessible throughout the review period.


:twisted_rightwards_arrows: Git Workflow Requirements
This challenge enforces proper engineering workflow practices.
You are NOT allowed to:
push directly to the main branch
implement the entire project in a single commit
bypass pull request workflows
Required workflow:
create feature branches
open pull requests into main
maintain clear commit history
use descriptive PR titles and descriptions
Minimum requirement:
at least SEVEN (7) meaningful pull requests during the implementation process


:package: Technical Requirements
Must use:
Next.js (App Router)
TypeScript
Allowed:
TailwindCSS
Shadcn/UI
DnD Kit
React Hook Form
Zustand/Jotai/Redux
Must include:
modular architecture
reusable components
typed query models
clean folder structure
no console errors

:closed_lock_with_key: Security & Stability Requirements
You must:
sanitize generated queries
validate imported JSON
prevent malformed recursive structures
safely handle dynamic rendering
unit testing

:iphone: UI/UX Expectations
The application should feel:
professional
scalable
technically mature
highly interactive
Expected:
polished interactions
smooth nesting experience
intuitive controls
readable query structures
responsive layouts
Avoid:
cluttered UIs
confusing nesting behavior
laggy recursive rendering

:test_tube: Acceptance Criteria
You will be graded on:
:white_check_mark: Recursive UI engineering
:white_check_mark: Query architecture quality
:white_check_mark: State management design
:white_check_mark: Dynamic schema handling
:white_check_mark: Query generation correctness
:white_check_mark: Performance optimization
:white_check_mark: UX quality
:white_check_mark: Validation system
:white_check_mark: Scalability
:white_check_mark: Code quality
:white_check_mark: Unit Testing

:package: Submission Requirements
Submit:
:white_check_mark: GitHub repository
:white_check_mark: Live deployed URL
:white_check_mark: README including:
architecture explanation
recursive rendering strategy
state management decisions
query engine design
performance optimization techniques
trade-offs made
:white_check_mark: Demo video (3–7 mins recommended)

:trophy: Evaluation Focus
This stage prioritizes:
frontend systems thinking
recursive UI engineering
state architecture
interaction complexity
scalability
performance engineering
technical depth
engineering maturity
unit testing

Deadline 11:59AM, 1st June, 2026.look at our new task. God i want to start crying


:rocket: Frontend Wizards — Stage 8 @channel
One Last Dance: Build a Visual Query Builder with Next.js

:dart: Objective
Build a highly interactive visual query builder that allows users to construct complex database/API queries through a graphical interface instead of writing raw query syntax manually.
Think:
Postman query builders
Supabase filters
MongoDB Compass
GraphQL explorers
advanced admin filtering systems
Users should be able to:
visually create filters
group conditions
nest logic
preview generated queries
execute simulated queries
inspect results dynamically
This challenge evaluates:
recursive UI engineering
complex state management
schema-driven rendering
frontend systems architecture
interaction engineering
scalability

:brain: What the Application Should Do
The application should allow users to:
choose a data source/schema
visually construct queries
nest logical conditions
dynamically add/remove rules
preview generated query syntax
simulate query execution
inspect returned results
The system should support advanced nested logic like:
(age > 18 AND country = "Nigeria")
OR
(status = "active" AND purchases > 10)

without requiring users to write raw query syntax manually.

:jigsaw: Required Features

:one: Dynamic Query Rule Builder
Users must be able to create query rules visually.
Each rule should contain:
field selector
operator selector
value input
Example:
Field: Age
Operator: Greater Than
Value: 18

Supported operators should include:
equals
not equals
contains
starts with
greater than
less than
in array
between
Bonus:
regex
null checks
date comparisons

:two: Nested Condition Groups
Users must be able to create nested groups.
Supported logic:
AND
OR
Example:
Group A
 ├── Condition 1
 ├── Condition 2
 └── Nested Group
      ├── Condition 3
      └── Condition 4

Requirements:
unlimited nesting depth
collapsible groups
add/remove conditions dynamically
reorder conditions/groups
This is one of the most important evaluation areas.

:three: Schema-Driven Query System
The query builder must adapt dynamically based on a provided schema.
Example schema:
{
  name: "string",
  age: "number",
  status: "enum",
  createdAt: "date"
}

The UI should:
render correct input types
restrict invalid operators
validate values
generate context-aware controls
Examples:
date picker for dates
number inputs for numeric fields
dropdowns for enums

:four: Live Query Preview
As users build queries, the application must generate:
• SQL-like syntax
OR
• Mongo-style query objects
OR
• GraphQL filters
Example:
SELECT * FROM users
WHERE age > 18
AND status = 'active'

OR:
{
  "age": { "$gt": 18 },
  "status": "active"
}

The preview must update in real time.

:five: Query Execution Simulator
Users must be able to:
execute queries
filter a dataset
inspect matching results
Requirements:
mock dataset support
dynamic filtering
result count display
loading states
empty states
Bonus:
pagination
sorting
virtualization

:six: State Management Architecture
This challenge heavily evaluates frontend architecture.
Expected:
normalized query tree structure
recursive state handling
reusable abstractions
immutable updates
scalable architecture

:seven: Recursive Component Engineering
The UI must support recursive rendering.
You will likely need:
recursive condition groups
recursive query parsing
recursive tree traversal
Your implementation should remain:
maintainable
performant
extensible

:eight: Query Validation Engine
The system must:
prevent invalid queries
validate incompatible operators
handle empty states gracefully
surface validation errors clearly
Examples:
prevent “contains” on numbers
prevent invalid date ranges
prevent empty nested groups

:nine: Performance Optimization
Your application will be tested with:
deeply nested conditions
large datasets
many rules/groups
You must optimize:
unnecessary re-renders
recursive updates
query parsing
rendering performance
Expected techniques:
memoization
derived state
stable keys
component isolation

:keycap_ten: Advanced Interactions
Include all of the following:
:white_check_mark: Drag-and-drop condition reordering
:white_check_mark: Keyboard shortcuts
:white_check_mark: Collapsible groups
:white_check_mark: Query history
:white_check_mark: Saved query presets
:white_check_mark: Export/import query JSON
:white_check_mark: Dark/light mode
:white_check_mark: Animated transitions

:test_tube: Testing Requirements
You must implement unit and integration tests for critical parts of the application.
At minimum, tests should cover:
query generation logic
recursive condition/group rendering
validation engine behavior
state management logic
utility/helper functions
critical UI interactions
Suggested tools:
Vitest
Jest
React Testing Library
Cypress or Playwright (optional)
Your tests should demonstrate:
correctness
edge-case handling
maintainability
confidence in your architecture
The focus is not on test quantity alone, but on meaningful test coverage for complex systems behavior.

:rocket: Continuous Deployment (CD) Requirements
You must configure automatic deployment using one of the following:
Vercel
Netlify
Your deployment pipeline must:
automatically deploy changes from your repository
generate preview deployments for pull requests
maintain a stable production deployment
The live deployed URL must remain accessible throughout the review period.


:twisted_rightwards_arrows: Git Workflow Requirements
This challenge enforces proper engineering workflow practices.
You are NOT allowed to:
push directly to the main branch
implement the entire project in a single commit
bypass pull request workflows
Required workflow:
create feature branches
open pull requests into main
maintain clear commit history
use descriptive PR titles and descriptions
Minimum requirement:
at least SEVEN (7) meaningful pull requests during the implementation process


:package: Technical Requirements
Must use:
Next.js (App Router)
TypeScript
Allowed:
TailwindCSS
Shadcn/UI
DnD Kit
React Hook Form
Zustand/Jotai/Redux
Must include:
modular architecture
reusable components
typed query models
clean folder structure
no console errors

:closed_lock_with_key: Security & Stability Requirements
You must:
sanitize generated queries
validate imported JSON
prevent malformed recursive structures
safely handle dynamic rendering
unit testing

:iphone: UI/UX Expectations
The application should feel:
professional
scalable
technically mature
highly interactive
Expected:
polished interactions
smooth nesting experience
intuitive controls
readable query structures
responsive layouts
Avoid:
cluttered UIs
confusing nesting behavior
laggy recursive rendering

:test_tube: Acceptance Criteria
You will be graded on:
:white_check_mark: Recursive UI engineering
:white_check_mark: Query architecture quality
:white_check_mark: State management design
:white_check_mark: Dynamic schema handling
:white_check_mark: Query generation correctness
:white_check_mark: Performance optimization
:white_check_mark: UX quality
:white_check_mark: Validation system
:white_check_mark: Scalability
:white_check_mark: Code quality
:white_check_mark: Unit Testing

:package: Submission Requirements
Submit:
:white_check_mark: GitHub repository
:white_check_mark: Live deployed URL
:white_check_mark: README including:
architecture explanation
recursive rendering strategy
state management decisions
query engine design
performance optimization techniques
trade-offs made
:white_check_mark: Demo video (3–7 mins recommended)

:trophy: Evaluation Focus
This stage prioritizes:
frontend systems thinking
recursive UI engineering
state architecture
interaction complexity
scalability
performance engineering
technical depth
engineering maturity
unit testing

Deadline 11:59AM, 1st June, 2026.