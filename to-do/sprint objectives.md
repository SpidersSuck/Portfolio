# Day 2: User Experience Design & Testing Strategies + Course Path Options

## Course: CptS 483 Special Topic - Coding with Agentic AI  
## Week: 11 | Day: 2 (Wednesday)
## Date: October 29, 2025
## Duration: 50 minutes
## Focus: B-Range vs A-Range Path Decision, UX (User Experience) Principles, Error Handling, Edge Case Testing

---

## Learning Objectives

By the end of this session, students will be able to:
- **Understand course completion options** and make informed decision about B-Range (5 sprints) vs A-Range (6 sprints) path
- **Apply UX (User Experience) principles** to technical applications for intuitive user interactions
- **Implement robust error handling** that guides users through failures gracefully
- **Identify and test edge cases** systematically beyond "happy path" scenarios
- **Assess Sprint 2 progress** and troubleshoot implementation challenges

---

## Required Materials
- Laptops with development environment and projects
- Sprint 2 feature implementations (near completion)
- Edge case testing worksheet (provided)
- AI coordination tools for UX (User Experience) evaluation and testing

---

## Session Structure

### Opening & Course Path Announcement (8 minutes)

#### Project Completion Options: B-Range vs A-Range (5 minutes)
**Two Paths to Success**:

**B-Range Path (5 Sprints - Default)**:
- Complete Sprints 1-5 (Weeks 8-14)
- Final project demonstration in Week 15
- Sprint 5 peer review based on Week 14-15 demonstrations
- Solid foundation for portfolio and career readiness

**A-Range Path (6 Sprints - Optional Challenge)**:
- Complete Sprints 1-5 (Weeks 8-14)
- **Present current project state to entire class in Week 14**
- **Propose Sprint 6 plan** demonstrating ambition and scope
- Execute Sprint 6 during Week 15
- **Sprint 6 due Friday, December 12** (Finals week)
- Demonstrates exceptional drive and capability

**Decision Deadline**: Canvas survey due by **Friday, October 31** (Week 11 Day 3)
- Survey link will be posted after today's class
- You may change your mind up until the survey deadline
- Commitment helps instructor plan Week 14-15 schedule

**Week 14-15 Schedule Preview**:
- Week 14 Days 1-3: A-range students present + propose Sprint 6
- Week 15 Days 1-2: B-range students present final projects
- Week 15 Day 3: Cross-Track Analysis, Portfolio Review, Course Wrapup
- Sprint 5 peer reviews conducted asynchronously based on demonstrations

#### Transition to Today's Content (3 minutes)
**From Working Code to Great User Experience**:
- Regardless of path chosen, quality matters
- Features that work technically but confuse users fail the mission
- Today's focus: Making projects usable, robust, and professional
- Sprint 2 goal: Not just working features, but polished user experiences

### User Experience Principles for Technical Projects (10 minutes)

#### Core UX (User Experience) Concepts (5 minutes)
**User-Centered Design Fundamentals**:

**1. User Mental Models**
- How do users expect your application to behave?
- What workflows are intuitive vs. confusing?
- Does UI (User Interface) match user expectations from similar applications?

**Examples by Track**:
- **Game**: Players expect WASD (W=up, A=left, S=down, D=right keyboard keys) or arrow keys for movement, ESC (Escape key) to pause
- **Web**: Users expect navigation in header, forms to validate on submit
- **Mobile**: Users expect swipe gestures, back button to work logically
- **Data Science/ML (Machine Learning)**: Users expect visualizations to update when parameters change

**2. Feedback and Confirmation**
- Users need immediate feedback when actions occur
- Loading states show progress for slow operations
- Confirmations prevent accidental destructive actions
- Success/failure messages guide next steps

**Good Feedback Examples**:
- ✓ "Saving..." → "Profile updated successfully!"
- ✓ Loading spinner while API (Application Programming Interface) call executes
- ✓ "Are you sure you want to delete this?" confirmation dialog
- ✓ Form validation errors appear next to problematic fields

**Poor Feedback Examples**:
- ✗ Silent save with no confirmation
- ✗ Frozen UI (User Interface) during long operation (user thinks it crashed)
- ✗ Generic error: "Something went wrong"
- ✗ Form just refreshes without explaining validation failures

**3. Error Prevention and Recovery**
- Design interfaces that prevent errors when possible
- When errors happen, provide clear recovery paths
- Never leave users stuck without options
- Validate input before attempting operations

**Error Prevention Strategies**:
- Disable submit buttons until form is valid
- Provide format hints (e.g., "MM/DD/YYYY" for dates)
- Use appropriate input types (number fields, date pickers)
- Confirm destructive actions before executing

#### AI-Assisted UX (User Experience) Evaluation (5 minutes)
**Using AI Agents for UX Improvement**:

**UX Review Prompts**:
- "Review this user flow and identify potential confusion points"
- "Suggest improvements to make this interface more intuitive"
- "What error scenarios am I not handling in this feature?"
- "How can I provide better feedback to users during this operation?"

**Example Workflow**:
```
1. Describe feature and user workflow to AI
2. Ask AI to identify potential UX (User Experience) issues
3. Implement suggested improvements
4. Test improvements with peers or AI simulation
5. Document UX decisions in project notes
```

**AI Simulation Technique**:
- Prompt: "Act as a user trying to [task]. What would confuse you?"
- Prompt: "What questions would a user have when seeing this screen?"
- Use AI to role-play user confusion and identify gaps

**Track-Specific UX Considerations**:

**Game Development**:
- Tutorial/onboarding for game mechanics
- Clear visual feedback for player actions
- Intuitive controls with remappable keys
- Pause/resume functionality always accessible

**Web Development**:
- Mobile-responsive design (works on all screen sizes)
- Fast page loads with loading indicators
- Clear navigation and breadcrumbs
- Accessible forms with keyboard navigation

**Mobile Development**:
- Touch-friendly button sizes and spacing
- Offline mode handling and sync indicators
- Permission requests with clear explanations
- Back button behavior matches user expectations

**Data Science/ML (Machine Learning)**:
- Clear explanations of results and insights
- Interactive visualizations with hover details
- Parameter controls with sensible defaults
- Export options for results/reports

### Error Handling and Edge Case Testing (15 minutes)

#### Comprehensive Error Handling (7 minutes)
**Error Categories and Handling Strategies**:

**1. Input Validation Errors**
- User provides invalid or malformed input
- Handle before attempting operations
- Provide specific guidance on what's wrong

**Examples**:
- Empty required fields → "Email is required"
- Invalid format → "Email must include @domain.com"
- Out of range → "Age must be between 1 and 120"

**2. System Errors**
- Network failures, database errors, API (Application Programming Interface) issues
- Can't be prevented by validation alone
- Must handle gracefully with recovery options

**Examples**:
- Network timeout → "Connection lost. Retry or save draft?"
- API error → "Unable to load data. Refresh page or try again later"
- Database failure → "Error saving. Your work is backed up locally"

**3. State Errors**
- Invalid operations for current application state
- Prevent through UI (User Interface) design when possible
- Handle when prevention isn't feasible

**Examples**:
- "Can't submit empty form" → Disable submit until valid
- "Can't proceed without login" → Redirect to login page
- "Can't delete while in use" → Show warning with affected dependencies

**Error Handling Implementation Pattern**:
```
1. Try to prevent error through UI (User Interface) design
2. If error still possible, validate before operation
3. If operation fails, catch error and provide user-friendly message
4. Offer recovery path (retry, cancel, alternative action)
5. Log technical details for debugging (not for user)
```

**AI-Assisted Error Handling**:
- Prompt: "What error conditions should I handle in this function?"
- Prompt: "Generate user-friendly error messages for these exceptions"
- Prompt: "Suggest try-catch structure for this API call"

#### Edge Case Identification and Testing (8 minutes)
**Beyond the Happy Path**:

**Common Edge Cases by Category**:

**1. Empty/Missing Data**
- Empty strings, null values, undefined variables
- Empty arrays/lists/collections
- Missing optional parameters

**Test Examples**:
- What happens if user submits empty form?
- What if API returns empty result set?
- What if optional configuration is not provided?

**2. Boundary Conditions**
- Minimum and maximum values
- First and last items in collections
- Start and end of ranges

**Test Examples**:
- What if array has only one item? Zero items?
- What if numeric input is at exact min/max boundary?
- What if user is on first/last page of results?

**3. Invalid or Malformed Data**
- Wrong data types
- Unexpected formats
- Corrupted or partial data

**Test Examples**:
- What if user enters text in number field?
- What if file upload is corrupted?
- What if JSON response is malformed?

**4. Concurrent or Out-of-Order Operations**
- Multiple actions happening simultaneously
- Operations completing in unexpected order
- User interacting during async operations

**Test Examples**:
- What if user clicks button multiple times rapidly?
- What if user navigates away while save is in progress?
- What if two API calls return in reverse order?

**Systematic Edge Case Testing Activity** (3 minutes):
**Individual Work**: Complete Edge Case Testing Worksheet

**For each feature implemented**:
1. List happy path user flow
2. Identify edge cases for each step
3. Test each edge case manually
4. Implement error handling where needed
5. Document edge case testing in `.context/` logs

**AI Testing Assistant**:
- Prompt: "What edge cases should I test for [feature]?"
- Prompt: "Generate test scenarios including edge cases for [functionality]"
- Prompt: "What could go wrong when user [performs action]?"

### Sprint 3 Progress Check and Work Time (9 minutes)

#### Mid-Sprint Assessment (2 minutes)
**Self-Assessment Questions**:
- Which Sprint 2 features are in progress?
- What's working well and what's blocked?
- Are you on track for Monday's peer review?
- What specific help do you need?

**Track Group Check-Ins**:
- Share progress updates with track peers
- Identify common challenges or blockers
- Exchange solutions and troubleshooting tips
- Coordinate peer support during development

#### Guided Work Time and Troubleshooting (7 minutes)
**Individual Development Work**:
- Continue Sprint 2 feature implementation
- Apply UX principles and error handling from today's lesson
- Test edge cases systematically using worksheet
- Document AI coordination in `.context/` logs

**Instructor/TA Support**:
- Circulate to troubleshoot specific issues
- Review UX designs and error handling approaches
- Help debug edge case failures
- Provide guidance on Sprint 2 progress concerns

### Session Closing & Next Steps (8 minutes)

#### Action Items: Canvas Survey & Sprint 2 (4 minutes)
**URGENT - Canvas Survey Due Friday**:
- Survey will be posted after class today
- **Decision: B-Range (5 sprints) or A-Range (6 sprints)?**
- Due by **Friday, October 31 by 10pm**
- Consider your commitments, ambitions, and Finals week capacity
- You may discuss with peers, but decision is individual

**Sprint 2 Completion Plan**:
- Polish all implemented features with UX improvements
- Complete comprehensive testing (happy path + edge cases)
- Implement robust error handling for all workflows
- Update project README with Sprint 2 achievements

**Development Checklist**:
- [ ] All features working beyond just "happy path"
- [ ] Error conditions handled with user-friendly messages
- [ ] Edge cases identified and tested systematically
- [ ] AI coordination documented in `.context/` logs
- [ ] Meaningful commits with incremental progress
- [ ] README updated with current status and demo instructions

#### Upcoming Schedule Preview (4 minutes)
**Week 12 Focus**: Sprint 3 execution
- Monday: Sprint 3 peer review (Sprint 2 completion)
- Wednesday & Friday: Advanced topics and implementation

**Weeks 13-14**: Sprints 4-5 execution and refinement

**Week 14 Demonstrations** (Schedule depends on survey results):
- A-range students present current state + Sprint 6 proposals
- Peer reviews conducted asynchronously based on demonstrations
- More details after survey closes Friday

**Week 15**: Final demonstrations and course wrapup
- B-range students present completed projects
- A-range students execute Sprint 6 (due Dec 12)
- Cross-track analysis and portfolio review

**Key Dates**:
- **Friday Oct 31**: Canvas survey due (B-range vs A-range commitment)
- **Monday Nov 3**: Sprint 3 peer review (Sprint 2 completion)
- **Week 14**: A-range presentations begin
- **Week 15**: B-range presentations + course wrapup
- **Friday Dec 12**: Sprint 6 due (A-range students only)

---

## Assessment Integration

### Formative Assessment
- **UX understanding** through design discussions and improvements
- **Error handling implementation** in Sprint 2 features
- **Edge case testing discipline** documented in worksheets
- **Sprint 2 progress** assessed through working demonstrations

### Preparation for Summative Assessment
- **User experience quality** impacts final project evaluation
- **Robustness and error handling** demonstrate professional practices
- **Comprehensive testing** reduces demo failures and bugs

---

## Edge Case Testing Worksheet

### Feature: _______________________________

#### Happy Path User Flow
**Steps**:
1. 
2. 
3. 
4. 

---

#### Edge Case Categories

**Empty/Missing Data Edge Cases**:
| Edge Case | Expected Behavior | Tested? | Handled? | Notes |
|-----------|------------------|---------|----------|-------|
| | | [ ] | [ ] | |
| | | [ ] | [ ] | |

**Boundary Condition Edge Cases**:
| Edge Case | Expected Behavior | Tested? | Handled? | Notes |
|-----------|------------------|---------|----------|-------|
| | | [ ] | [ ] | |
| | | [ ] | [ ] | |

**Invalid/Malformed Data Edge Cases**:
| Edge Case | Expected Behavior | Tested? | Handled? | Notes |
|-----------|------------------|---------|----------|-------|
| | | [ ] | [ ] | |
| | | [ ] | [ ] | |

**Concurrent/Out-of-Order Edge Cases**:
| Edge Case | Expected Behavior | Tested? | Handled? | Notes |
|-----------|------------------|---------|----------|-------|
| | | [ ] | [ ] | |
| | | [ ] | [ ] | |

---

#### Error Handling Implementation

**Errors Handled**:
1. 
2. 
3. 

**User-Friendly Messages**:
1. 
2. 
3. 

**Recovery Paths Provided**:
1. 
2. 
3. 

---

#### AI Coordination for Testing

**Prompts Used**:
- 
- 

**Edge Cases Identified by AI**:
- 
- 

**Testing Strategies Suggested by AI**:
- 
- 

---

## Resources

### Class Materials
- **Edge Case Testing Worksheet**: Provided in class (embedded above)

### Reference Documentation
- UX design principles for technical projects
- Error handling best practices by track
- Edge case identification strategies
- AI-assisted testing patterns
