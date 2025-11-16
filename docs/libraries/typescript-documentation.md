### Define Generic React Component and Interface (TypeScript)

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/jsxCheckJsxNoTypeArgumentsAllowed.errors.txt

This TypeScript declaration file (`component.d.ts`) defines a generic React component `MyComp` and an interface `Prop`. `MyComp` extends `React.Component` and accepts a generic type `P` for its internal state. The `Prop` interface specifies `a` as a number and `b` as a string, serving as a type definition for component props.

```typescript
    import * as React from "react";
    export declare class MyComp<P> extends React.Component<P, {}> {
        internalProp: P;
    }

    export interface Prop {
        a: number,
        b: string
    }
```

--------------------------------

### TypeScript Interface Definitions for Configuration

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/signatureCombiningRestParameters3.errors.txt

Defines configuration interfaces (`ExtensionConfig`, `NodeConfig`, `MarkConfig`) for different types of extensions. These interfaces primarily define an optional `extendMarkSchema` method, which can take an `extension` of its specific type and return a `Record<string, any>`, allowing for schema extension customization.

```typescript
interface ExtensionConfig<Options = any> {
  extendMarkSchema?:
    | ((
        this: {
          name: string;
          options: Options;
        },
        extension: Mark,
      ) => Record<string, any>)
    | null;
}

interface NodeConfig<Options = any> {
  extendMarkSchema?:
    | ((
        this: {
          name: string;
          options: Options;
        },
        extension: Node,
      ) => Record<string, any>)
    | null;
}

interface MarkConfig<Options = any> {
  extendMarkSchema?:
    | ((
        this: {
          name: string;
          options: Options;
        },
        extension: Mark,
      ) => Record<string, any>)
    | null;
}
```

--------------------------------

### Define React Component Types and Interfaces in TypeScript

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/tsxAttributeResolution12.errors.txt

This snippet provides TypeScript declarations for the `JSX` namespace, a generic `Component` class, and a custom component `TestMod.Test` that requires a `reqd` property. These declarations establish the type system rules used by TypeScript for React component type checking, defining how elements and components are structured and validated.

```typescript
declare namespace JSX {
	interface Element { }
	interface IntrinsicElements {
	}
	interface ElementAttributesProperty {
		props;
	}
	interface IntrinsicAttributes {
		ref?: string;
	}
}

declare class Component<P, S>  {
	constructor(props?: P, context?: any);
	setState(f: (prevState: S, props: P) => S, callback?: () => any): void;
	setState(state: S, callback?: () => any): void;
	forceUpdate(callBack?: () => any): void;
	render(): JSX.Element;
	props: P;
	state: S;
	context: {};
}


interface ComponentClass<P> {
	new (props?: P, context?: any): Component<P, any>;
}

declare namespace TestMod {
	interface TestClass extends ComponentClass<{reqd: any}> {
	}
	var Test: TestClass;
}
```

--------------------------------

### Define React JSX Interfaces in TypeScript

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/tsxAttributeResolution10.errors.txt

This TypeScript definition snippet outlines the fundamental interfaces for React's JSX namespace. It declares `Element`, `IntrinsicElements`, and `ElementAttributesProperty` to enable type-checking for JSX elements and their attributes within a TypeScript project.

```typescript
declare namespace JSX {
	interface Element { }
	interface IntrinsicElements {
	}
	interface ElementAttributesProperty {
		props;
	}
}
```

--------------------------------

### TypeScript JSX Namespace and Props Definition

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/tsxAttributeResolution9.errors.txt

This code snippet, typically found in a React declaration file (e.g., react.d.ts), defines the global JSX namespace and an interface `Props`. The `Props` interface specifies that the `foo` property must be a string, establishing the expected type for component attributes.

```typescript
declare namespace JSX {
	interface Element { }
	interface IntrinsicElements {
	}
	interface ElementAttributesProperty {
		props;
	}
}

interface Props {
  foo: string;
}
```

--------------------------------

### TypeScript Configuration Interface with Server Dependencies

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/project/visibilityOfTypeUsedAcrossModules/node/visibilityOfTypeUsedAcrossModules.errors.txt

Defines the IConfiguration interface that bundles workspace and optional server references for command execution. This interface imports and uses IWorkspace and IServer types from the server module, enabling configuration objects to provide necessary context for file system operations and command execution.

```typescript
import fs = require('fs');
import server = require('server');

export interface IConfiguration {
    workspace: server.IWorkspace;
    server?: server.IServer;
}
```

--------------------------------

### Define React Component Interfaces and Generic Components in TypeScript

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/tsxTypeArgumentResolution.errors.txt

This snippet defines a basic interface 'Prop' and two generic React components, 'MyComp' and 'MyComp2'. 'MyComp' is a simple generic component, while 'MyComp2' includes a type constraint on its first generic parameter and a default type for its second.

```typescript
import React = require('react');

interface Prop {
    a: number,
    b: string
}

declare class MyComp<P> extends React.Component<P, {}> {
    internalProp: P;
}

declare class MyComp2<P extends { a: string }, P2 = {}> extends React.Component<P & P2, {}> {
    internalProp: [P, P2];
}
```

--------------------------------

### Define ESLint Plugin Configuration Interfaces (TypeScript)

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/exportAssignmentExpressionIsExpressionNode.errors.txt

This TypeScript declaration file defines the `PluginConfig` interface and related `configs` and `_default` objects. It specifies the structure for ESLint plugin configurations, including an optional `parser` property which can be `string`, `null`, or `undefined`.

```typescript
interface PluginConfig {
  parser?: string | null;
}
declare const configs: {
    'stage-0': PluginConfig;
};
declare const _default: {
    configs: {
        'stage-0': PluginConfig;
    };
};
export default _default;
export { configs };
```

--------------------------------

### React Component with TypeScript Interface

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/checkJsxChildrenProperty5.errors.txt

Defines a React Button component and an interface for component props, showing type errors when props are missing or incorrectly typed.

```typescript
import React = require('react');

interface Prop {
    a: number,
    b: string,
    children: Button;
}

class Button extends React.Component<any, any> {
    render() {
        return (<div>My Button</div>)
    }
}

function Comp(p: Prop) {
    return <div>{p.b}</div>;
}

// Error: no children specified
let k = <Comp a={10} b="hi" />;

// Error: JSX.element is not the same as JSX.ElementClass
let k1 =
    <Comp a={10} b="hi">
        <Button />
    </Comp>;
let k2 =
    <Comp a={10} b="hi">
        {Button}
    </Comp>;
```

--------------------------------

### Define React User Interface and FetchUser Render Prop Component (TypeScript)

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/checkJsxChildrenProperty4.errors.txt

This snippet defines a basic `IUser` interface with a `Name` property and a `FetchUser` class component. The `FetchUser` component implements a render prop pattern, where its `children` prop is explicitly typed as a function that accepts an `IUser` object and returns a `JSX.Element`.

```typescript
import React = require('react');

interface IUser {
    Name: string;
}

interface IFetchUserProps {
    children: (user: IUser) => JSX.Element;
}

class FetchUser extends React.Component<IFetchUserProps, any> {
    render() {
        return this.state
            ? this.props.children(this.state.result)
            : null;
    }
}
```

--------------------------------

### React Component Type Definitions

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/tsxUnionElementType4.errors.txt

Defines multiple React component classes with different prop interfaces to demonstrate type compatibility issues

```TypeScript
import React = require('react');

class RC1 extends React.Component<{x : number}, {}> {
    render() {
        return null;
    }
}

class RC2 extends React.Component<{ x: string }, {}> {
    render() {
        return null;
    }
    private method() { }
}

class RC3 extends React.Component<{}, {}> {
    render() {
        return null;
    }
}

class RC4 extends React.Component<{}, {}> {
    render() {
        return null;
    }
}
```

--------------------------------

### Define React component with TypeScript (TSX) interfaces

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/tsxDeepAttributeAssignabilityError.errors.txt

Defines a React functional component and its prop interfaces. Depends on React and TypeScript; inputs are props x (string) and y (MyInnerProps with value: string); output is rendered JSX. Limitation: TypeScript enforces types at compile time so runtime mismatches will be caught during build.

```TypeScript (TSX)
import * as React from 'react'

interface MyProps {
    x: string;
    y: MyInnerProps;
}

interface MyInnerProps {
    value: string;
}

export function MyComponent(_props: MyProps) {
    return <span>my component</span>;
}

```

--------------------------------

### Define React Component with Explicit Prop Interface and Default Props

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/reactDefaultPropsInferenceSuccess.errors.txt

This snippet defines `MyPropsProps` to explicitly type the `when` prop as a function returning `boolean`. The `FieldFeedback2` class extends `FieldFeedback` and uses this interface, providing a `defaultProps` for `when` and demonstrating prop access.

```typescript
    interface MyPropsProps extends Props {
      when: (value: string) => boolean;
    }

    class FieldFeedback2<P extends MyPropsProps = MyPropsProps> extends FieldFeedback<P> {
      static defaultProps = {
        when: () => true
      };

      render() {
        this.props.when("now"); // OK, always defined
        return <div>Hello</div>;
      }
```

--------------------------------

### TypeScript React Component with Type Mismatch

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/jsxChildrenWrongType.errors.txt

This example shows a React component with a PropsType interface that expects either a tuple of [string, optional number] or an iterable of booleans. The JSX usage fails because it provides incompatible types (unknown and string) that don't match the defined constraints.

```TypeScript
interface PropsType {
    children: [string, number?] | Iterable<boolean>;
}
declare class Foo extends React.Component<PropsType, {}> {}
const b = (
    <Foo>
        {<div/> as unknown}
        {"aa"}
    </Foo>
);
```

--------------------------------

### Define Redux Core Action and Dispatch Interfaces (TypeScript)

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/reactReduxLikeDeferredInferenceAllowsAssignment.errors.txt

These TypeScript interfaces define the fundamental `Dispatch` and `Action` types used in Redux. `Dispatch` specifies the function signature for dispatching actions, while `Action` and `AnyAction` establish the basic structure for all actions, ensuring type consistency across the Redux store.

```typescript
interface Dispatch<A extends Action = AnyAction> {
  <T extends A>(action: T): T;
}
interface Action<T = any> {
  type: T;
}
interface AnyAction extends Action {
  [extraProps: string]: any;
}
```

--------------------------------

### TypeScript Complex Generic Interfaces and Indexed Access Types (Issue #32365)

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/mappedTypeRelationships.errors.txt

This set of interfaces and type aliases showcases advanced generic type manipulation. It defines flexible 'Settings' interfaces using indexed access types and union types to create specific or generic configurations, addressing issue #32365.

```typescript
interface SettingsTypes {
  audio: {
    volume: string;
  };
  video: {
    resolution: string;
  };
}
interface Settings<Params extends { [K in keyof Params]?: string }> {
  config: Params;
}
type ConcreteSettingsResult1 = Settings<SettingsTypes["audio"]>;
type ConcreteSettingsResult2 = Settings<SettingsTypes["audio" | "video"]>;
type GenericSettingsAccess<T extends keyof SettingsTypes> = Settings<SettingsTypes[T]>;
type GenericSettingsResult1 = GenericSettingsAccess<"audio">;
type GenericSettingsResult2 = GenericSettingsAccess<"audio" | "video">;
```

--------------------------------

### TypeScript PropTypeChecker Interface and Marker

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/tsxLibraryManagedAttributes.errors.txt

Declares the `PropTypeChecker` interface and a unique symbol `checkedType` used for type-checking properties. `PropTypeChecker` mimics the behavior of React's PropTypes, providing a runtime check function and a compile-time type inference mechanism (`checkedType`) to distinguish between required and optional types.

```typescript
declare const checkedType: unique symbol;
interface PropTypeChecker<U, TRequired = false> {
    (props: any, propName: string, componentName: string, location: any, propFullName: string): boolean;
    isRequired: PropTypeChecker<U, true>;
    [checkedType]: TRequired extends true ? U : U | null | undefined;
}
```

--------------------------------

### Demonstrate Prop Type Mismatch with Explicit Interface (Void to Boolean)

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/reactDefaultPropsInferenceSuccess.errors.txt

Similar to previous type errors, this snippet illustrates passing a `void`-returning function to the `when` prop of `FieldFeedback2`. Despite the explicit interface `MyPropsProps`, TypeScript still flags this as `TS2769` due to the inherent type incompatibility.

```tsx
const Test4 = () => <FieldFeedback2 when={value => console.log(value)} />;
```

--------------------------------

### Define TypeScript Interfaces with Explicit and Implicit 'this' Types

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/thisTypeInFunctions2.errors.txt

This snippet defines two TypeScript interfaces, 'IndexedWithThis' and 'IndexedWithoutThis', to illustrate how explicit 'this' parameters ('this: this') influence contextual typing for methods within objects implementing the interface. 'IndexedWithThis' uses an explicit 'this' parameter for 'init' to preserve the type, while 'IndexedWithoutThis' omits it, representing a common pattern in libraries like React.

```typescript
interface IndexedWithThis {
    // this is a workaround for React
    init?: (this: this) => void;
    willDestroy?: (this: any) => void;
    [propName: string]: number | string | boolean | symbol | undefined | null | {} | ((this: any, ...args:any[]) => any);
}
interface IndexedWithoutThis {
    // this is what React would like to write (and what they write today)
    init?: () => void;
    willDestroy?: () => void;
    [propName: string]: any;
}
```

--------------------------------

### Define TypeScript State Machine Configuration and Action Types

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/contextualTypeFunctionObjectPropertyIntersection.errors.txt

This snippet defines a generic `Action` type for event handlers and an `interface MachineConfig` for state machine configurations. It uses conditional types and mapped types to ensure type safety for event properties and wildcards, allowing for specific event handlers or a general wildcard handler. A `createMachine` function is declared to demonstrate its usage with these types.

```typescript
type Action<TEvent extends { type: string }> = (ev: TEvent) => void;

interface MachineConfig<TEvent extends { type: string }> {
  schema: {
    events: TEvent;
  };
  on?: {
    [K in TEvent["type"]]?: Action<TEvent extends { type: K } ? TEvent : never>;
  } & {
    "*"?: Action<TEvent>;
  };
}

declare function createMachine<TEvent extends { type: string }>(
  config: MachineConfig<TEvent>
): void;
```

--------------------------------

### TypeScript Type Mismatch in React Component Prop 'nextValues'

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/checkJsxGenericTagHasCorrectInferences.errors.txt

This TypeScript/React code defines a `GenericComponent` with a `nextValues` prop that expects a function returning a type `T`. The example demonstrates various usages, highlighting a `TS2322` error when the function passed to `nextValues` for variable `d` returns a `string` instead of the expected object type `{ x: string; }`, causing a type incompatibility.

```tsx
    import * as React from "react";
    interface BaseProps<T> {
      initialValues: T;
      nextValues: (cur: T) => T;
    }
    declare class GenericComponent<Props = {}, Values = object> extends React.Component<Props & BaseProps<Values>, {}> {
      iv: Values;
    }

    let a = <GenericComponent initialValues={{ x: "y" }} nextValues={a => a} />; // No error
    let b = <GenericComponent initialValues={12} nextValues={a => a} />; // No error - Values should be reinstantiated with `number` (since `object` is a default, not a constraint)
    let c = <GenericComponent initialValues={{ x: "y" }} nextValues={a => ({ x: a.x })} />; // No Error
    let d = <GenericComponent initialValues={{ x: "y" }} nextValues={a => a.x} />; // Error - `string` is not assignable to `{x: string}`
```

--------------------------------

### Define TypeScript Interfaces for SvgIcon Component

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/declarationEmitPathMappingMonorepo2.errors.txt

This declaration file defines the interfaces necessary for an `SvgIcon` component. It includes `SvgIconProps` extending `StyledComponentProps` for handling styling, `SomeInterface` as an example, and a `declare const` for the `SvgIcon` component itself.

```typescript
import { StyledComponentProps } from "@ts-bug/styles";
export interface SvgIconProps extends StyledComponentProps<"root"> {
    children?: string[];
}
export interface SomeInterface {
    myProp: string;
}
declare const SvgIcon: SomeInterface;
export default SvgIcon;
```

--------------------------------

### React Component with Type Errors

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/tsxAttributeResolution14.errors.txt

React component with TypeScript interface prop definitions causing type assignment errors

```typescript
interface IProps {
  primaryText: string,
  [propName: string]: string | number
}

function VerticalNavMenuItem(prop: IProps) {
  return <div>props.primaryText</div>
}

function VerticalNav() {
  return (
    <div>
      <VerticalNavMenuItem primaryText={2} />  // error
                           ~~~~~~~~~~~
!!! error TS2322: Type 'number' is not assignable to type 'string'.
!!! related TS6500 file.tsx:2:3: The expected type comes from property 'primaryText' which is declared here on type 'IProps'
      <VerticalNavMenuItem justRandomProp={2} primaryText={"hello" />  // ok
      <VerticalNavMenuItem justRandomProp1={true} primaryText={"hello" />}  // error
                           ~~~~~~~~~~~~~~~
!!! error TS2322: Type 'boolean' is not assignable to type 'string | number'.
!!! related TS6501 file.tsx:3:3: The expected type comes from this index signature.
    </div>
  )
}
```

--------------------------------

### TypeScript: Chaining IPromise .then() with Compatible `nIPromise` Callbacks

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/promisePermutations.errors.txt

This example demonstrates a successful chain of `.then()` calls on an `IPromise<number>` (`r8`) using `nIPromise` as the callback. This works because the signature of `nIPromise` (e.g., `(x: any) => IPromise<number>`) is compatible with the expected callback types for `then`, allowing proper type inference and compilation.

```typescript
var r8b = r8.then(nIPromise, nIPromise, nIPromise).then(nIPromise, nIPromise, nIPromise); // ok
```

--------------------------------

### Define TypeScript Interfaces for Standard and Custom Promise Types

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/promisePermutations3.errors.txt

These TypeScript interface definitions specify the structure and behavior of promise-like objects. The `Promise<T>` interface includes multiple `then` overloads to handle various return types and error handlers, along with a `done` method. The `IPromise<T>` interface provides a simpler `then` overload and an optional `done` method, highlighting potential type compatibility challenges when mixing these promise implementations.

```typescript
interface Promise<T> {
    then<U>(success?: (value: T) => Promise<U>, error?: (error: any) => Promise<U>, progress?: (progress: any) => void): Promise<U>;
    then<U>(success?: (value: T) => Promise<U>, error?: (error: any) => U, progress?: (progress: any) => void): Promise<U>;
    then<U>(success?: (value: T) => U, error?: (error: any) => Promise<U>, progress?: (progress: any) => void): Promise<U>;
    then<U>(success?: (value: T) => U, error?: (error: any) => U, progress?: (progress: any) => void): Promise<U>;
    done<U>(success?: (value: T) => any, error?: (error: any) => any, progress?: (progress: any) => void): void;
}

interface IPromise<T> {
    then<U>(success?: (value: T) => U, error?: (error: any) => U, progress?: (progress: any) => void): IPromise<U>;
    done? <U>(success?: (value: T) => any, error?: (error: any) => any, progress?: (progress: any) => void): void;
}
```

--------------------------------

### TypeScript Attribute Types and Base Interface

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/excessPropertyCheckWithMultipleDiscriminants.errors.txt

Defines TypeScript interfaces and union types for modeling database attributes with optional properties and type-specific configurations

```typescript
export interface BaseAttribute<T> {
    required?: boolean | undefined;
    defaultsTo?: T | undefined;
};

export type Attribute =
    | string
    | StringAttribute
    | NumberAttribute
    | OneToOneAttribute

export type Attribute2 =
    | string
    | StringAttribute
    | NumberAttribute

export type StringAttribute = BaseAttribute<string> & {
    type: 'string';
};

export type NumberAttribute = BaseAttribute<number> & {
    type: 'number';
    autoIncrement?: boolean | undefined;
};

export type OneToOneAttribute = BaseAttribute<any> & {
    model: string;
};
```

--------------------------------

### Chain Promises with Object Types in TypeScript

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/promisePermutations2.errors.txt

This snippet demonstrates promise chaining using `.then()` for `IPromise` and `Promise` instances that resolve to an object type `{ x: number; }`. It explores different combinations of success, error, and progress handlers with `testFunction2` and `testFunction2P`, showcasing how type inference and compatibility work for complex types in promise chains.

```typescript
var r2: IPromise<{ x: number; }>;
var r2a = r2.then(testFunction2, testFunction2, testFunction2);
var r2b = r2.then(testFunction2, testFunction2, testFunction2).then(testFunction2, testFunction2, testFunction2);
var s2: Promise<{ x: number; }>;
var s2a = s2.then(testFunction2, testFunction2, testFunction2);
var s2b = s2.then(testFunction2P, testFunction2P, testFunction2P);
var s2c = s2.then(testFunction2P, testFunction2, testFunction2);
var s2d = s2.then(testFunction2P, testFunction2, testFunction2).then(testFunction2, testFunction2, testFunction2);
```

--------------------------------

### Define React Component Props and Redux Connect Setup (TypeScript)

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/reactReduxLikeDeferredInferenceAllowsAssignment.errors.txt

This section illustrates defining TypeScript interfaces for a React component's own properties (`OwnProps`) and combined properties (`TestComponentProps`), including actions mapped from Redux. It also shows the `mapDispatchToProps` object for connecting action creators to the component and how to use `connect` to create a Redux-aware component.

```typescript
interface OwnProps {
  foo: string;
}
interface TestComponentProps extends OwnProps {
  simpleAction: typeof simpleAction;
  thunkAction(param1: number, param2: string): Promise<string>;
}
class TestComponent extends Component<TestComponentProps> {}
const mapDispatchToProps = { simpleAction, thunkAction };

const Test1 = connect(
  null,
  mapDispatchToProps
)(TestComponent);
```

--------------------------------

### Define JSX Global Interfaces and React Type Declarations in TypeScript

Source: https://github.com/microsoft/typescript/blob/main/tests/baselines/reference/tsxSpreadChildrenInvalidType(jsx=react-jsx,target=es5).errors.txt

This snippet establishes global JSX interfaces for `Element` and `IntrinsicElements`, along with a declaration for `React`, providing the necessary foundational type definitions for JSX usage within a TypeScript project.

```typescript
declare namespace JSX {
    	interface Element { }
    	interface IntrinsicElements {
    		[s: string]: any;
    	}
    }
    declare var React: any;
