FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore
COPY ["Core/DomainLayer/DomainLayer.csproj", "Core/DomainLayer/"]
COPY ["Core/ServiceAbstraction/ServiceAbstraction.csproj", "Core/ServiceAbstraction/"]
COPY ["Core/Service/Service.csproj", "Core/Service/"]
COPY ["Shared/Shared.csproj", "Shared/"]
COPY ["InfraStracture/Persistence/Persistence.csproj", "InfraStracture/Persistence/"]
COPY ["InfraStracture/Presentation/Presentation.csproj", "InfraStracture/Presentation/"]
COPY ["E-Commerce.Web/E-Commerce.Web.csproj", "E-Commerce.Web/"]

RUN dotnet restore "E-Commerce.Web/E-Commerce.Web.csproj"

# Copy full source and build
COPY . .
WORKDIR "/src/E-Commerce.Web"
RUN dotnet publish "E-Commerce.Web.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "E-Commerce.Web.dll"]
