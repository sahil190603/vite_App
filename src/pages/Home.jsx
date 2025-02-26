import React, { useState } from "react";
import { Avatar, Card, Col, Input, Row, message, Spin } from "antd";
import { LoadingOutlined, SendOutlined } from "@ant-design/icons";
import MediaQueryHandler from "../components/Hooks/MediaQueryhandler";

const formatTitle = (text) =>
  text.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const RenderContent = ({ content }) => {
  if (typeof content === "object" && content !== null) {
    // Render arrays as a list
    if (Array.isArray(content)) {
      return (
        <ul>
          {content.map((item, idx) => (
            <li key={idx}>
              <RenderContent content={item} />
            </li>
          ))}
        </ul>
      );
    }
    // Render objects by iterating over their keys
    return (
      <div>
        {Object.entries(content).map(([key, value]) => (
          <div key={key} style={{ marginBottom: 8 }}>
            <strong>{formatTitle(key)}:</strong>{" "}
            <RenderContent content={value} />
          </div>
        ))}
      </div>
    );
  }
  // Render primitive types (strings, numbers, etc.)
  return <span>{content}</span>;
};

// Component to dynamically display the entire analysis response
const DynamicAnalysisDisplay = ({ analysisResponse }) => {
  if (!analysisResponse || typeof analysisResponse !== "object") {
    return null;
  }
  return (
    <>
      {Object.entries(analysisResponse).map(([sectionKey, sectionContent]) => {
        const title = formatTitle(sectionKey);
        return (
          <Card
            key={sectionKey}
            type="inner"
            title={title}
            style={{ marginBottom: 16 }}
          >
            <RenderContent content={sectionContent} />
          </Card>
        );
      })}
    </>
  );
};

function Home() {
  const [userQuery, setUserQuery] = useState("");
  const [analysisResponse, setAnalysisResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = localStorage.getItem("theme");
  const { isMobile } = MediaQueryHandler();

  const handleInputChange = (e) => {
    setUserQuery(e.target.value);
  };

  const handleSend = async () => {
    if (!userQuery.trim()) {
      message.error("Please enter your prompt.");
      return;
    }
    setAnalysisResponse(null);
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/process_financial_query/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_query: userQuery }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process the query");
      }

      const data = await response.json();
      // Assuming the backend response is { data: { ... } }
      setAnalysisResponse(data.data);
      message.success("Analysis result fetched successfully!");
    } catch (error) {
      message.error("Error processing the query");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 75px)",
      }}
    >
      <Card
        style={{
          textAlign: "center",
          borderRadius: "2px",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          overflowY: "auto",
        }}
      >
        <Row gutter={16} style={{ height: "100%" }}>
          {/* Left Column: User Prompt */}
          <Col span={isMobile ? 24 : 12} style={{ height: "100%" }}>
            <Card
              style={{
                height: "100%",
                borderRadius: "2px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                minHeight: "calc(100vh - 135px)",
                boxShadow:
                  theme === "dark"
                    ? "0 0 10px rgb(182, 182, 182)"
                    : "0 4px 12px rgba(0, 0, 0, 0.54)",
              }}
            >
              <div>
                <Card.Meta
                  avatar={
                    <Avatar src="https://ui.shadcn.com/avatars/shadcn.jpg" />
                  }
                  title="User Entered Prompt"
                  description={
                    <div
                      style={{
                        maxHeight: "calc(100vh - 250px)",
                        overflowY: "auto",
                      }}
                    >
                      {userQuery || "No prompt entered yet."}
                    </div>
                  }
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  padding: "10px",
                }}
              >
                <Input
                  size="middle"
                  placeholder="Enter your statement here..."
                  style={{ borderRadius: "15px", width: "100%" }}
                  suffix={
                    loading ? (
                      <Spin
                        indicator={<LoadingOutlined spin />}
                        style={{ padding: "5px" }}
                      />
                    ) : (
                      <div
                        style={{
                          backgroundColor: "#4096ff",
                          width: "30px",
                          borderRadius: "20px",
                        }}
                      >
                        <SendOutlined
                          style={{
                            height: "30px",
                            // color: "#4096ff",
                          }}
                          onClick={handleSend}
                        />
                      </div>
                    )
                  }
                  value={userQuery}
                  onChange={handleInputChange}
                  onPressEnter={handleSend}
                />
              </div>
            </Card>
          </Col>

          {/* Right Column: Generated Financial Analysis */}
          <Col span={isMobile? 24 : 12} style={{ marginTop: isMobile ? 20 : 0}}>
            <Card
              style={{
                height: "calc(100vh - 135px)",
                borderRadius: "2px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                boxShadow:
                  theme === "dark"
                    ? "0 0 10px rgb(182, 182, 182)"
                    : "0 4px 12px rgba(0, 0, 0, 0.54)",
              }}
            >
              <div>
                <Spin
                  spinning={loading}
                  size="large"
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: "calc(100vh - 135px)",
                  }}
                >
                  {/* Render the dynamic analysis when not loading */}
                  {!loading && (
                    <>
                      {analysisResponse ? (
                        <DynamicAnalysisDisplay
                          analysisResponse={analysisResponse}
                        />
                      ) : (
                        <Card.Meta
                          title="Generated Financial Analysis"
                          description="No analysis generated yet."
                        />
                      )}
                    </>
                  )}
                </Spin>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default Home;
