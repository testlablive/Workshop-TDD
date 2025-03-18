# Workshop-TDD
Begleitendes Repo zum Seminar Einführung in Test Driven Development (TDD) @ Objektkultur Software GmbH

# Demo PlanningPokerApi TDD
## Setup Backend
Wir entwickeln das Backend von Grund auf und starten mit einer leeren Visual Studio Solution. Dazu kann entweder das PowerShell script `init-backend-solution.ps` ausgeführt werden, oder die folgenden cmdlets direkt in PowerShell.

Um einen Ordner für das Backend zu erstellen und in diesen zu navigieren:
`mkdir backend`

`cd backend`

Eine neue Visual Studio Solution und Projekte erstellen:
`dotnet new sln -n PlanningPokerApi`

`dotnet new webapi --use-controllers -o PlanningPokerApi`

`dotnet new xunit -o PlanningPokerApi.Tests`

`dotnet sln add PlanningPokerApi`

`dotnet sln add PlanningPokerApi.Tests`


Anschließend den nicht benötigten dummy Controller löschen:
`del PlanningPokerAPI\Controllers\WeatherForecastController.cs`

`del PlanningPokerAPI\Controllers\`

`del PlanningPokerAPI\WeatherForecast.cs`


Jetzt kann die Solution in Visual Studio geöffnet werden.

[Git commit Inital setup...](https://github.com/testlablive/Workshop-TDD/commit/1dab8d01f896964c27137facd1df2b730cb9950a)

## Ersten Test schreiben

### PlanningPokerApi Änderungen
In unserem Hauptprojekt müssen wir die Program class verfügbar machen, damit wir für das Testen eine `WebApplicationFactory<Program>` erstellen können. Dazu fügen wir am Ende der `Program.cs` eine partial class ein:
`public partial class Program { }`

### PlanningPokerApi.Tests Änderungen
Um einen ersten Test schreiben zu können, müssen wir zunächst in unserem Testprojekt eine Referenz zu unserem PlanningPokerApi-Projekt hinzufügen.
`Right Click > Add > Project Reference... > PlanningPokerApi`

Außerdem benötigen wir das NuGet Package
`Microsoft.AspNetCore.Mvc.Testing`

Für unseren ersten Test benennen wir `UnitTest1.cs` um zu `SessionTests.cs` und erstellen einen Test der lediglich überprüt, ob wir beim Starten einer Session per API den Status `HTTP 201 Created` erhalten.

#### Exkurs Testing Basics
Ein neuer Test wird in xUnit mit dem `[Fact]` Decorator über dem Klassennamen erstellt.
Wird ein leerer Test grün?
Wird ein Test grün, der false zurückgibt?
Ein Test wird nur rot, falls eine Exception geworfen wird.

Für unseren Statuscode Test erstellen wir zunächst eine neue `WebApplicationFactory<Program>` die uns mit `CreateClient()` einen Api Client bereitstellt. Mit diesem Client schicken wir einen PostRequest an unseren session endpoint und prüfen den HTTP Statuscode.

`[Fact]`

`public async Task StartSession_WithValidRequest_ReturnsCreated()`

`{`

`    var webapp = new WebApplicationFactory<Program>();`

`    var client = webapp.CreateClient();`

`    var addResponse = await client.PostAsJsonAsync("session", new`

`    {`

`       title = "Any valid planning session",`

`       description = "Planning Poker for any valid planning session"`

`    });`

` `

`    Assert.Equal(System.Net.HttpStatusCode.Created, addResponse.StatusCode);`

`}`

Bei der Benamsung der Tests gibt es unterschiedliche Konventionen. Wichtig ist hier innerhalb der Tests konsistent zu bleiben. Was sich bewährt hat, ist beispielsweise analog zu Gherkin (Given - When - Then) den Dreiklang 
1. Was wird getestet
2. Unter welchen Voraussetzungen
3. Erwartetes Ergebnis
zu nutzen. Beispielsweise `StartSession_WithValidRequest_ReturnsCreated`. Tests und Testnamen schreiben wir für Menschen und nicht für den Compiler. Sie müssen in erster Linie leicht verständlich erklären, was man mit dem Test erreichen will.

Wenn wir unseren Test starten, erhalten wir wie erwartet einen roten, fehlgeschlagen Testlauf. Da es noch keine Route in unserer API gibt, erhalten wir entsprechend den Status Code `HTTP 404 NotFound`.

[Git commit 1-RED...](https://github.com/testlablive/Workshop-TDD/commit/d9fd122615dfb1b18a062c6f0c7d0bb5af2f665b)
### Minimale Implementierung
Gemäß TDD schreiben wir jetzt die minimale Implementierung, damit die Testbedingung erfüllt ist und der Test grün wird. In unserem Fall entspricht dies einem Controller, der auf Post Requests für die session Route mit Statuscode 201 antwortet.

`using Microsoft.AspNetCore.Mvc;`

` `

`namespace PlanningPokerApi;`

` `

`[ApiController]`

`[Route("[controller]")]`

`public class SessionController : ControllerBase`

`{`

`     [HttpPost]`

`     public ActionResult StartSession()`

`     {`

`         return Created("", null);`

`     }`

`}`

[Git commit 1-GREEN...](https://github.com/testlablive/Workshop-TDD/commit/b6170032bd117137bfd6842c0ee6f3f631249b57)

## Live Unit Testing aktivieren
Bevor wir einen weiteren Test schreiben, aktivieren wir das Feature *Live Unit Testing* in Visual Studio: `Test > Live Unit Testing > Start`
Damit werden bei jeder Codeänderung die entsprechenden Tests neugestartet und wir erhalten schneller Feedback.

## Zweiter Test: Return ID
Normalerweise folgt auf die Grün-Phase die Refactoring-Phase. Da wir aber bewusst nur die minimale Implementierung für den ersten Test umgesetzt haben, benötigen wir erst mehr Tests, um sinnvolle Reafctorings durchführen zu können.

Unser zweiter Test besteht darin, dass wir prüfen, dass wir nach dem Starten einer Session auch eine Session mit nicht-leerer ID erhalten.

[Git commit 2-RED...](https://github.com/testlablive/Workshop-TDD/commit/99f50e41db135ec6fd99f622fa6df98b71cd0b94)

Um die Testbedingung zu erfüllen, ist lediglich im Controller ein neues Objekt mit neu generierter GUID notwendig.

[Git commit 2-GREEN...](https://github.com/testlablive/Workshop-TDD/commit/6ef2ad7f8214e049402fad458ee0c035b3595949)

Jetzt kommen wir endlich in die erste Refactor-Phase.
Für unseren Controller macht es keinen Sinn ein anonymes neues Objekt zurückzugeben. Wir erstellen hierfür eine neue Klasse.

[Git commit 2-REFACTOR...](https://github.com/testlablive/Workshop-TDD/commit/6e5765cdc9ed73e805dbab8ee45f80054bc88961)

Nachdem wir den Controller refactored haben, d. h. den Production Code refactored haben, können wir uns auch unsere Tests anschauen. Diese benötigen ebenfalls ein Refactoring. Man bearbeitet allerdings **NIE** gleichzeitig Test und Production Code. Man kann sich das vorstellen wie bei der doppelten Buchhaltung: Man bearbeitet immer nur eine Seite und gleicht erst danach die andere aus. Im Normalfall bedeutet das wir machen eine Seite rot und fügen dann die notwendige Implementierung hinzu oder löschen den Test, der beispielsweise durch Änderung der Business Requirements und Entfernen der Implementierung im Production Code rot geworden ist.

Zunächst sollten wir uns an das Arrange Act Assert Pattern halten. Wir benötigen hier nicht jedes Mal die Kommentare, sondern können mit Leerzeilen das Pattern einhalten. Das verbessert die Lesbarkeit und jeder Entwickler sollte das AAA Pattern in Tests erwarten.

Außerdem fällt auf, dass wir in jedem Test ein Session Objekt erstellen, das wir an die API senden. Das werden wir in weiteren Tests vermutlich ebenfalls benötigen und entsprechend auslagern. Hier bietet sich eine BaseTests Klasse an, die eine TestDataBuilder Funktion bereitstellt. Z. B. unter dem Namen `GetAnyValidSession()` damit auch in den Tests klar wird, dass hier keine spezielle Session relevant ist, sondern wir nur irgendeine benötigen. Auch das verringert die kognitive Last beim Lesen unserer Tests.

Auch die Testfixture bzgl. Erstellung eines API-Clients kann aus den eigentlichen Tests nach oben gezogen werden.

[Git commit 2-REFACTOR...](https://github.com/testlablive/Workshop-TDD/commit/7c92ff148867694c8c62987882ef625fe4810cd5)

## Dritter Test: Return Location Header
Test hinzufügen, der Location Header Route testet.

[Git commit 3-RED](https://github.com/testlablive/Workshop-TDD/commit/ac1660dcab3ab65f43ba7c268c06ccbc0089bed1)

Controller anpassen, dass die Location Route mitgesendet wird.

[Git commit 3-GREEN](https://github.com/testlablive/Workshop-TDD/commit/27c79b5176b5fdede22fadb564bbf4d4ae52ae35)

## Vierter Test: Return Session Details
Test hinzufügen, der auf Title und Description testet.

[Git commit 4-RED](https://github.com/testlablive/Workshop-TDD/commit/159b3e66df8695d135d03e82df861fc29eb254f8)

Controller hardcoden, dass er Title und Description ausgibt.

[Git commit 4-GREEN](https://github.com/testlablive/Workshop-TDD/commit/ca61dc42c2da7f702324ddc1cd886edf02084a8d)

## Fünfter Test: Finally some persistence
Test und Hilfsklasse hinzufügen für Test `StartSession_WithValidRequest_CanBeRetrievedById`

[Git commit 5-RED](https://github.com/testlablive/Workshop-TDD/commit/56a3f64d70c72681ac5fce71f5f77c37f78eb460)

Für den Test müssen wir den Wert der Session persistieren, da wir die zufällig erzeugte Guid zurückgeben müssen.

Beim Hinzufügen des Get Endpunktes wird schnell kalr, dass wir für den Not Found Fall eine Unterscheidung benötigen. Die können wir einfügen, aber müssen direkt einen Test dafür anlegen.

[Git commit 5-GREEN](https://github.com/testlablive/Workshop-TDD/commit/2ca9277f237f7396ba8f2738022bea86f8aa1a7a)

Um zu veranschaulichen, dass wir damit jetzt auch größere Refactorings durchführen können, nutzen wir das Repository Pattern

[Git commit 5-REFACTOR](https://github.com/testlablive/Workshop-TDD/commit/135631943191424de9a8c09d79c38efacec73d31)


