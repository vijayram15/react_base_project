Based on your architecture blueprints and implementation strategy, here is the detailed breakdown of Each Stage of Flow in your project, from the moment the app loads to the final data submission.
This flow confirms how the Core Orchestrator (Parent) manages the Fields and Buttons (Footer) as discussed.
Stage 1: Bootstrapping (The Foundation)
Before any UI renders, the application initializes the technical infrastructure.
 * Entry Point (main.tsx): The app starts by initializing the i18nService to ensure no labels are blank (English Bypass).
 * Global Providers (App.tsx): The app wraps the entire React tree in:
   * TanStack Query: For caching metadata and financial data.
   * Router: To map URLs to specific "Screen Keys".
Stage 2: The Shell & Navigation
The visual frame loads, establishing the user's context.
 * Layout Rendering: The AppLayout renders the Tower (Header), Sidebar (Menu), and the Main Workspace.
 * Route Detection: The Router detects the current URL (e.g., /trade/fx) and tells the Core which screenKey to load.
 * Tier 2 Fetch: The Core triggers an asynchronous fetch for the Scheme Details (Metadata) for that specific screen.
Stage 3: Orchestration (The "Brain" Wakes Up)
This is where your CoreOrchestrator takes control inside the Modal or Screen.
 * Registry Build: The Core takes the fetched Metadata and builds the currentState (Data) and initialState (Baseline).
 * Bag Generation:
   * Fields Bag: It generates the fields object containing value, onChange, and onBlur for every field in the schema.
   * Buttons Bag: It generates the buttons object (Save, Submit, Audit) with their enabled, visible, and onClick handlers.
 * Proxy Initialization: The Core creates the "Bluff" Proxy, allowing the Validation Component to listen to these fields securely.
Stage 4: The Factory Render (UI Construction)
The UI is drawn based on the "Bags" generated in Stage 3.
 * Field Dispatch: The FormFieldDispatcher loops through the fields bag. It reads the metadata (e.g., uiType: 'DATE') and renders the correct proprietary component.
 * Command Bar (Footer): The Footer receives the buttons bag and renders the actions (Save, Submit) based on their visible flags.
Stage 5: The Interaction Loop (Runtime)
This is the secure "Handy" loop that runs while the user types.
 * User Input: The user types in a field -> fields.amount.onChange() triggers.
 * State Update: The Core updates the currentState and marks the field as isDirty (Yellow Highlight).
 * Proxy Event: The Validation Component detects the change via the Proxy.
 * Button Logic: If the validation fails (e.g., "Amount > Limit"), the Validation Component calls buttons.submit.setEnabled(false).
Stage 6: The "Modal-in-Modal" Handshake (Search)
If the user needs to look up data (e.g., Branch Code).
 * Trigger: User clicks the "Search" icon on a field.
 * Handshake: The Core opens a generic Selection Modal configured by the field's properties (lookupKey).
 * Return: When the user selects a row, the Modal passes the data back to the Core.
 * Sanitization: The Core runs DOMPurify on the returned data before updating the state.
Stage 7: Submission (The Exit)
The final commitment of data.
 * Trigger: User clicks "Submit" in the Footer.
 * Lock: The Core sets buttons.submit.loading = true.
 * Final Sweep: The Core runs a final validation check and sanitization on all fields.
 * API Call: The data is sent to the API via Axios.
 * History Sync: On success, lastDataCopy is updated to match currentState, removing all "Dirty" flags.


 Here is the Master Architectural Prompt that encapsulates every decision, state transition, and architectural rule we have established. You can use this prompt to generate the component (or I can execute it for you).
This covers the Core Orchestrator, the 9+ Props, the Button/Field Bags, and the "Handy" State Machine.
The Master Prompt: CoreOrchestrator Specification
Role:
Create the CoreOrchestrator component, which acts as the "Brain" of the Financial Framework. It is responsible for bridging the StateEngine (Registry) with the UI Layers (Body & Footer) without tightly coupling them.
1. The Input Interface (Props)
The component must accept a Configuration Object (Schema) and optional overrides:
 * schemedetails: (Object) The Database Metadata defining the fields (e.g., { amount: { type: 'number' } }).
 * buttonDetails: (Object) Optional overrides for button labels/visibility (e.g., { submit: { label: 'Post Trade' } }).
 * onSubmit: (Async Function) The function to call when the "Submit" action is fully validated and committed.
 * children: (Render Prop) A function that receives the "Orchestrator Props" object.
2. The Internal State Machine (Minute Details)
The component must manage these specific distinct states:
 * currentState: The live, mutable data from the useDraft hook.
 * initialState: The baseline data (for Reset logic).
 * lastDataCopy: A local snapshot taken after every successful save.
   * Usage: Used to calculate isDirty per field (Yellow Highlight logic).
 * touched: A record of visited fields { [fieldName]: boolean }.
   * Usage: Ensures errors only show after interaction.
 * btnState: A local registry for Button UI states.
   * Structure: { [btnKey]: { visible, enabled, loading } }.
   * Default: Save/Submit/Audit/Template are visible by default unless schemedetails or buttonDetails says otherwise.
3. The "Field Bag" Generator (The Body API)
Instead of passing raw handlers, the Core must generate a fields object where each key corresponds to a field name.
 * Iteration: Loop through keys in schemedetails.
 * Per-Field Props:
   * name: The field key.
   * value: The live value from currentState.
   * error: Returns the error string only if touched[key] is true.
   * isDirty: Returns true if value !== lastDataCopy[key].
   * onChange: A pre-bound function that calls updateState(key, value).
   * onBlur: A pre-bound function that sets touched[key] = true.
4. The "Button Bag" Generator (The Footer API)
The Core must generate a buttons object containing the state and Encapsulated Actions.
 * Iteration: Define standard keys (save, submit, audit, template).
 * Per-Button Props:
   * id: The button key.
   * label: Sourced from buttonDetails or defaults.
   * visible: Boolean flag (Security gate).
   * enabled: Boolean flag (Validation gate).
   * loading: Boolean flag (Async gate).
   * onClick: A pre-bound function that executes the specific workflow (see below).
5. Execution Workflows (Minute Details)
 * executeSubmit (The Submit Action):
   * Lock: Set btnState.submit.loading = true and enabled = false.
   * Validate: Run validation logic (check errors object). If invalid, Unlock and Stop.
   * Commit: Call save() (StateEngine commit).
   * Sync History: Set lastDataCopy = { ...currentState } (Removes "Dirty" flags).
   * API: Await onSubmit(currentState).
   * Unlock: Finally, set btnState.submit.loading = false and enabled = true.
 * handleBlurLogic:
   * Updates touched.
   * (Future Hook): Triggers the ValidationProxy to run business rules.
6. The Output (The 9+ Props Passed Down)
The children render prop must receive exactly this interface:
 * currentState
 * initialState
 * lastDataCopy
 * updateState (The raw modifier)
 * fields (The Bag)
 * buttons (The Bag)
 * schemedetails
 * isSubmitting
 * isValid
 * errors
